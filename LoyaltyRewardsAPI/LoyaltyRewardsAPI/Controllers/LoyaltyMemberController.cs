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

        [HttpGet("search")]
        public async Task<IActionResult> SearchMembers(string query) {
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
            return Ok(matchingMembers);
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListMembers() {
            return Ok(await db.Members.ToListAsync());
        }
    }
}
