using AutoMapper;
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
        private readonly IMapper mapper;
        public TransactionController(AppDatabase db, IConfiguration config, IMapper mapper) { this.db = db; this.config = config; this.mapper = mapper; }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction([FromBody] PartialTransaction newTransaction) {
            if (newTransaction.MemberId == null ||
                newTransaction.PointsEarned == null
                ) {
                return BadRequest("Missing required parameters.");
            }

            Member? member = await db.Members.FindAsync(newTransaction.MemberId);
            if (member == null) {
                return BadRequest("No member with that ID found.");
            }

            if (member.Points + newTransaction.PointsEarned < 0) {
                return StatusCode(StatusCodes.Status402PaymentRequired, "Member doesn't have enough points to redeem.");
            }

            Transaction transaction = mapper.Map<Transaction>(newTransaction);
            if (newTransaction.Employee == null) {
                transaction.Employee = "System";
            }

            transaction.Date = DateTimeOffset.Now.ToUnixTimeMilliseconds();

            member.Points += newTransaction.PointsEarned.Value;

            db.Update(member);
            await db.Transactions.AddAsync(transaction);
            await db.SaveChangesAsync();

            return Ok(mapper.Map<PartialTransaction>(transaction));
        }

        [HttpGet]
        public async Task<IActionResult> GetTransaction(int transactionId) {
            Transaction? transaction = await db.Transactions.FindAsync(transactionId);
            if (transaction == null) {
                return NotFound("No transaction with that ID found.");
            }

            return Ok(mapper.Map<PartialTransaction>(transaction));
        }

        [HttpPatch]
        public async Task<IActionResult> UpdateTransaction(int transactionId, [FromBody] PartialTransaction updatedTransaction) {
            Transaction? transaction = await db.Transactions.FindAsync(transactionId);
            if (transaction == null) {
                return NotFound("No transaction with that ID found.");
            }

            if (updatedTransaction.PointsEarned.HasValue) {
                // Find member
                Member? member = await db.Members.FindAsync(transaction.Member.Id);
                if (member == null) {
                    return NotFound("No member found with associated transaction!");
                }

                int diff = updatedTransaction.PointsEarned.Value - transaction.PointsEarned;
                member.Points += diff;
                db.Members.Update(member);

                transaction.PointsEarned = updatedTransaction.PointsEarned.Value;
            }

            if (updatedTransaction.Employee != null) {
                transaction.Employee = updatedTransaction.Employee;
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
            return Ok("Transaction deleted successfully.");
        }
    }
}
