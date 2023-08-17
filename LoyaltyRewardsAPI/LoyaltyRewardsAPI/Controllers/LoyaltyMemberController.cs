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
        public LoyaltyMemberController(AppDatabase db, IConfiguration config) { this.db = db; this.config = config; }

        // CRUD
        [HttpPost]
        public async Task<IActionResult> CreateMember([FromBody] Member newMember) {
            if (ModelState.IsValid) {
                newMember.AccountCreateTime = DateTime.UtcNow.Ticks;
                newMember.LastUpdatedTime = DateTime.UtcNow.Ticks;
                newMember.Points = config.GetValue<int>("AppSettings:NewMemberPoints");

                await db.Members.AddAsync(newMember);
                await db.SaveChangesAsync();

                Transaction transaction = new Transaction {
                    MemberId = newMember.Id,
                    Date = DateTimeOffset.Now.ToUnixTimeMilliseconds(),
                    PointsEarned = config.GetValue<int>("AppSettings:NewMemberPoints"),
                    Employee = "System"
                };

                await db.Transactions.AddAsync(transaction);
                await db.SaveChangesAsync();

                return Ok(newMember);
            } else {
                return BadRequest(ModelState);
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetMember(int memberId) {
            Member? member = await db.Members.FindAsync(memberId);
            if (member == null) {
                return NotFound("No user with that ID found.");
            } else {
                return Ok(member);
            }
        }
        [HttpPatch]
        public async Task<IActionResult> UpdateMember(int memberId, [FromBody] PartialMember updatedMember) {
            Member? member = await db.Members.FindAsync(memberId);
            if (member == null) {
                return NotFound("No user with that ID found.");
            }

            if (!string.IsNullOrWhiteSpace(updatedMember.FirstName)) member.FirstName = updatedMember.FirstName;
            if (!string.IsNullOrWhiteSpace(updatedMember.LastName)) member.LastName = updatedMember.LastName;
            if (!string.IsNullOrWhiteSpace(updatedMember.Email)) member.Email = updatedMember.Email;
            if (updatedMember.Points.HasValue) member.Points = updatedMember.Points.Value;

            db.Members.Update(member);
            await db.SaveChangesAsync();

            return Ok(member);
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
            query = query.Substring(2).Trim().ToUpper();
            query = WebUtility.UrlDecode(query);
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
        public async Task<IActionResult> ListMembers(int page, int entries) {
            Tuple<int, List<Member>>? results = PaginateList(await db.Members.OrderByDescending(u => u.Points).Take(entries * (page + 1)).ToListAsync(), page, entries, true);
            if (results == null) {
                return BadRequest("Page index out of bounds.");
            }
            return Ok(results);
        }

        [HttpGet("transactions")]
        public async Task<IActionResult> GetAllTransactions(int memberId) {
            List<Transaction> transactions = await db.Transactions.Where(x => x.MemberId == memberId).OrderByDescending(x => x.Date).ToListAsync();
            Member? member = await db.Members.FindAsync(memberId);
            if (member == null) {
                return NotFound("No member with that ID found.");
            }
            int sum = transactions.Sum(x => x.PointsEarned);
            member.Points = sum;
            db.Update(member);
            await db.SaveChangesAsync();
            return Ok(transactions);
        }
    }
}
