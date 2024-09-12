using LoyaltyRewardsAPI.Data.Models;
using LoyaltyRewardsAPI.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LoyaltyRewardsAPI.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class RewardController : ControllerBase {
        private readonly AppDatabase db;
        private readonly IConfiguration config;
        public RewardController(AppDatabase db, IConfiguration config) { this.db = db; this.config = config; }

        [HttpPost]
        public async Task<IActionResult> CreateReward(int rewardId) {
            return StatusCode(500, "Not implemented.");
        }
        [HttpGet]
        public async Task<IActionResult> GetReward(int rewardId) {
            return Ok(await db.Rewards.FindAsync(rewardId));
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetAllRewards() {
            return Ok(await db.Rewards.ToListAsync());
        }
        [HttpPatch]
        public async Task<IActionResult> UpdateReward(int rewardId) {
            return StatusCode(500, "Not implemented.");
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteReward(int rewardId) {
            return StatusCode(500, "Not implemented.");
        }
    }
}
