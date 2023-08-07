using LoyaltyRewardsAPI.Data;
using LoyaltyRewardsAPI.Data.Models;
using Microsoft.AspNetCore.Mvc;

namespace LoyaltyRewardsAPI.Controllers {
    public class TransactionController : ControllerBase {
        private readonly AppDatabase db;
        private readonly IConfiguration config;
        public TransactionController(AppDatabase db, IConfiguration config) { this.db = db; this.config = config; }

        [HttpPost("{id}")]
        public async Task<IActionResult> CreateTransaction(int memberId, [FromBody] Transaction transaction) {

            return Ok();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransaction(int transactionId) {
            return Ok();
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateTransaction(int transactionId, [FromBody] PartialTransaction updatedTransaction) {
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int transactionId) {
            return Ok();
        }
    }
}
