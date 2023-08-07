using LoyaltyRewardsAPI.Data;
using LoyaltyRewardsAPI.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
                return Ok(newMember);
            } else {
                return BadRequest(ModelState);
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMember(int id) {
            Member? member = await db.Members.FindAsync(id);
            if (member == null) {
                return NotFound("No user with that ID found.");
            } else {
                return Ok(member);
            }
        }
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateMember(int id, [FromBody] PartialMember updatedMember) {
            Member? member = await db.Members.FindAsync(id);
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(int id) {
            Member? member = await db.Members.FindAsync(id);
            if (member == null) {
                return NotFound("No user with that ID found.");
            }
            db.Members.Remove(member);
            await db.SaveChangesAsync();
            return Ok("Member deleted successfully");
        }


        private Tuple<int, List<Member>>? PaginateList(List<Member> members, int page, int entries, bool isList = false) {
            int allowedPages = members.Count / entries + (members.Count % entries > 0 ? 1 : 0);
            if (page >= allowedPages) {
                return null;
            }

            Tuple<int, List<Member>> results = new Tuple<int, List<Member>>(isList ? 3 : allowedPages, new List<Member>());

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
            query = query.Trim().ToUpper();
            string[] tokens = query.Split(" ");
            List<Member> matchingMembers = new List<Member>();

            for (int i = 0; i < tokens.Length && i < 5; i++) {
                var members = await db.Members.Where(u =>
                        u.FirstName.ToUpper().Contains(tokens[i])
                     || u.LastName.ToUpper().Contains(tokens[i])
                     || u.Email.ToUpper().Contains(tokens[i])).ToListAsync();
                matchingMembers.AddRange(members);
            }

            if (matchingMembers.Count == 0) {
                return NotFound("No users found matching the search criteria.");
            }

            Tuple<int, List<Member>>? results = PaginateList(matchingMembers, page, entries);
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
    }
}
