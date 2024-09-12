using LoyaltyRewardsAPI.Data;
using LoyaltyRewardsAPI.Data.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.Metrics;
using System.Net;

namespace LoyaltyRewardsAPI.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class TransactionController : ControllerBase {
        private readonly AppDatabase db;
        private readonly IConfiguration config;
        public TransactionController(AppDatabase db, IConfiguration config) { this.db = db; this.config = config; }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction([FromBody] Transaction transaction) {
            if (ModelState.IsValid) {
                Member? member = await db.Members.FindAsync(transaction.MemberId);
                if (member == null) {
                    return BadRequest("No member with that ID found.");
                }

                if (member.Points + transaction.PointsEarned < 0) {
                    return StatusCode(StatusCodes.Status402PaymentRequired, "Member doesn't have enough points to redeem.");
                }
                transaction.Member = member;
                transaction.Date = DateTimeOffset.Now.ToUnixTimeMilliseconds();

                member.Points += transaction.PointsEarned;
                db.Update(member);
                await db.Transactions.AddAsync(transaction);
                await db.SaveChangesAsync();
                return Ok(transaction);
            } else {
                return BadRequest(ModelState);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetTransaction(int transactionId) {
            return Ok(await db.Transactions.FindAsync(transactionId));
        }

        [HttpPatch]
        public async Task<IActionResult> UpdateTransaction(int transactionId, [FromBody] PartialTransaction updatedTransaction) {
            Transaction? transaction = await db.Transactions.FindAsync(transactionId);
            if (transaction == null) {
                return NotFound("No transaction with that ID found.");
            }

            if (updatedTransaction.Date.HasValue) transaction.Date = updatedTransaction.Date.Value;
            if (updatedTransaction.PointsEarned.HasValue) {
                int diff = updatedTransaction.PointsEarned.Value - transaction.PointsEarned;
                // Find member
                Member? member = await db.Members.FindAsync(transaction.Member.Id);
                if (member == null) {
                    return NotFound("No member found with associated transaction!");
                }

                member.Points += diff;
                db.Members.Update(member);

                transaction.PointsEarned = updatedTransaction.PointsEarned.Value;

            }

            db.Transactions.Update(transaction);
            await db.SaveChangesAsync();

            return Ok(transaction);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteTransaction(int transactionId) {
            Transaction? transaction = await db.Transactions.FindAsync(transactionId);
            if (transaction == null) {
                return NotFound("No transaction with that ID found.");
            }

            Member? member = await db.Members.FindAsync(transaction.MemberId);
            if (member == null) {
                return NotFound("No member found with associated transaction!");
            }

            member.Points -= transaction.PointsEarned;
            db.Update(member);

            db.Transactions.Remove(transaction);
            await db.SaveChangesAsync();
            return Ok("Transaction deleted successfully");
        }
    }
}
