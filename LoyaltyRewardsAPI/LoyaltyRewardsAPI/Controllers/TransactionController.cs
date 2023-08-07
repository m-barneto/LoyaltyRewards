using LoyaltyRewardsAPI.Data;
using LoyaltyRewardsAPI.Data.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.Metrics;

namespace LoyaltyRewardsAPI.Controllers {
    public class TransactionController : ControllerBase {
        private readonly AppDatabase db;
        private readonly IConfiguration config;
        public TransactionController(AppDatabase db, IConfiguration config) { this.db = db; this.config = config; }

        [HttpPost("{transactionId}")]
        public async Task<IActionResult> CreateTransaction(int transactionId, [FromBody] Transaction transaction) {
            return Ok();
        }

        [HttpGet("{transactionId}")]
        public async Task<IActionResult> GetTransaction(int transactionId) {
            return Ok(await db.Transactions.FindAsync(transactionId));
        }

        [HttpPatch("{transactionId}")]
        public async Task<IActionResult> UpdateTransaction(int transactionId, [FromBody] PartialTransaction updatedTransaction) {
            Transaction? transaction = await db.Transactions.FindAsync(transactionId);
            if (transaction == null) {
                return NotFound("No transaction with that ID found.");
            }

            if (!string.IsNullOrWhiteSpace(updatedTransaction.Date)) transaction.Date = updatedTransaction.Date;
            if (updatedTransaction.PointsEarned.HasValue) {
                int diff = updatedTransaction.PointsEarned.Value - transaction.PointsEarned;
                // Find member
                Member? member = await db.Members.FindAsync(transaction.MemberId);
                if (member == null) {
                    return StatusCode(500, "No member found with associated transaction!");
                }
                // Update member points here???


                transaction.PointsEarned = updatedTransaction.PointsEarned.Value;

            }

            db.Transactions.Update(transaction);
            await db.SaveChangesAsync();

            return Ok(transaction);
        }

        [HttpDelete("{transactionId}")]
        public async Task<IActionResult> DeleteTransaction(int transactionId) {
            return Ok();
        }
    }
}
