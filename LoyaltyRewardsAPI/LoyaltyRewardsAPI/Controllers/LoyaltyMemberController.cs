using AutoMapper;
using LoyaltyRewardsAPI.Data;
using LoyaltyRewardsAPI.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Diagnostics.Metrics;
using System.Net;

namespace LoyaltyRewardsAPI.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class LoyaltyMemberController : ControllerBase {
        private readonly AppDatabase db;
        private readonly IConfiguration config;
        private readonly IMapper mapper;
        public LoyaltyMemberController(AppDatabase db, IConfiguration config, IMapper mapper) { this.db = db; this.config = config; this.mapper = mapper; }

        // CRUD
        [HttpPost]
        public async Task<IActionResult> CreateMember([FromBody] PartialMember newMember) {
            if (newMember.FirstName == null ||
                newMember.LastName == null ||
                newMember.Email == null ||
                newMember.Meta == null ||
                newMember.BirthdayMonth == null
                ) {
                return BadRequest("Missing required parameters.");
            }

            Member member = mapper.Map<Member>(newMember);

            member.AccountCreateTime = DateTime.UtcNow.Ticks;
            member.LastUpdatedTime = DateTime.UtcNow.Ticks;
            member.Points = config.GetValue<int>("AppSettings:NewMemberPoints");

            await db.Members.AddAsync(member);
            await db.SaveChangesAsync();

            Transaction transaction = new Transaction {
                MemberId = member.Id,
                Date = DateTimeOffset.Now.ToUnixTimeMilliseconds(),
                PointsEarned = config.GetValue<int>("AppSettings:NewMemberPoints"),
                Employee = "System"
            };

            await db.Transactions.AddAsync(transaction);
            await db.SaveChangesAsync();

            return Ok(mapper.Map<PartialMember>(member));
        }

        [HttpGet]
        public async Task<IActionResult> GetMember(int memberId) {
            Member? member = await db.Members.FindAsync(memberId);
            if (member == null) {
                return NotFound("No user with that ID found.");
            } else {
                return Ok(mapper.Map<PartialMember>(member));
            }
        }

        [HttpPatch]
        public async Task<IActionResult> UpdateMember(int memberId, [FromBody] PartialMember updatedMember) {
            Member? member = await db.Members.FindAsync(memberId);
            if (member == null) {
                return NotFound("No user with that ID found.");
            }

            if (updatedMember.FirstName != null) member.FirstName = updatedMember.FirstName;
            if (updatedMember.LastName != null) member.LastName = updatedMember.LastName;
            if (updatedMember.Email != null) member.Email = updatedMember.Email;
            if (updatedMember.Meta != null) member.Meta = updatedMember.Meta;
            if (updatedMember.BirthdayMonth != null) member.BirthdayMonth = updatedMember.BirthdayMonth;

            // TODO
            // Maybe i have to reset transactions here otherwise they would be out of sync...
            // I could just add a single transaction that negates their current balance
            if (updatedMember.Points.HasValue) member.Points = updatedMember.Points.Value;

            db.Members.Update(member);
            await db.SaveChangesAsync();

            return Ok(mapper.Map<PartialMember>(member));
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteMember(int memberId) {
            Member? member = await db.Members.FindAsync(memberId);
            if (member == null) {
                return NotFound("No user with that ID found.");
            }
            db.Members.Remove(member);
            await db.SaveChangesAsync();
            return Ok("Member deleted successfully");
        }

        private Tuple<int, List<Member>>? PaginateList(List<Member> members, int page, int entries, bool isList = false) {
            int allowedPages = members.Count / entries + (members.Count % entries > 0 ? 1 : 0);
            if (isList) {
                allowedPages = db.Members.Count() / entries + (db.Members.Count() % entries > 0 ? 1 : 0);
            }
            if (page >= allowedPages) {
                return null;
            }

            Tuple<int, List<Member>> results = new Tuple<int, List<Member>>(allowedPages, new List<Member>());

            int startIndex = page * entries;
            int endIndex = startIndex + entries;
            if (endIndex <= members.Count) {
                results.Item2.AddRange(members.GetRange(page * entries, entries));
            } else {
                results.Item2.AddRange(members.GetRange(startIndex, members.Count - startIndex));
            }

            return results;
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchMembers(int page, int entries, string query) {
            //query = query.Substring(2).Trim().ToUpper();
            //query = WebUtility.UrlDecode(query);
            query = query.ToUpper().Trim();
            string[] tokens = query.Split(" ");
            HashSet<Member> matchingMembers = new HashSet<Member>();

            for (int i = 0; i < tokens.Length && i < 5; i++) {
                if (tokens[i].Equals("")) continue;
                var members = await db.Members.Where(u =>
                        u.FirstName.ToUpper().Contains(tokens[i])
                     || u.LastName.ToUpper().Contains(tokens[i])
                     || u.Email.ToUpper().Contains(tokens[i])).ToListAsync();
                matchingMembers.UnionWith(members);
            }


            if (matchingMembers.Count == 0) {
                return Ok(new Tuple<int, List<Member>>(0, new List<Member>()));
            }

            Tuple<int, List<Member>>? results = PaginateList(matchingMembers.ToList(), page, entries);
            if (results == null) {
                return BadRequest("Page index out of bounds.");
            }

            return Ok(results);
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListMembers(int page = 0, int entries = 8) {
            Tuple<int, List<Member>>? results = PaginateList(await db.Members.OrderByDescending(u => u.Points).Take(entries * (page + 1)).ToListAsync(), page, entries, true);
            if (results == null) {
                return BadRequest("Page index out of bounds.");
            }
            // Convert returned list to partial members
            List<PartialMember> members = new List<PartialMember>(results.Item2.Count);
            foreach (var member in results.Item2) {
                members.Add(mapper.Map<PartialMember>(member));
            }
            return Ok(Tuple.Create(results.Item1, members));
        }

        [HttpGet("transactions")]
        public async Task<IActionResult> GetTransactions(int memberId) {

            Member? member = await db.Members.FindAsync(memberId);
            if (member == null) {
                return NotFound("No member with that ID found.");
            }

            await db.Entry(member).Collection(m => m.Transactions).LoadAsync();

            List<PartialTransaction> transactions = new List<PartialTransaction>(member.Transactions.Count);

            foreach (var transaction in member.Transactions.OrderByDescending(x => x.Date)) {
                transactions.Add(mapper.Map<PartialTransaction>(transaction));
            }

            return Ok(transactions);
        }
    }
}
