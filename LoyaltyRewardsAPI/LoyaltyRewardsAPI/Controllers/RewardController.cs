using LoyaltyRewardsAPI.Data.Models;
using LoyaltyRewardsAPI.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace LoyaltyRewardsAPI.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class RewardController : ControllerBase {
        private readonly AppDatabase db;
        private readonly IConfiguration config;
        private readonly IMapper mapper;
        public RewardController(AppDatabase db, IConfiguration config, IMapper mapper) { this.db = db; this.config = config; this.mapper = mapper; }

        [HttpPost]
        public async Task<IActionResult> CreateReward(int rewardId) {
            return StatusCode(500, "Not implemented.");
        }
        [HttpGet]
        public async Task<IActionResult> GetReward(int rewardId) {
            Reward? reward = await db.Rewards.FindAsync(rewardId);
            if (reward == null) {
                return NotFound("No reward with that ID found.");
            }

            return Ok(mapper.Map<PartialReward>(reward));
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetAllRewards() {
            List<Reward> actualRewards = await db.Rewards.ToListAsync();
            List<PartialReward> rewards = new List<PartialReward>(actualRewards.Count);
            foreach (Reward reward in actualRewards) {
                rewards.Add(mapper.Map<PartialReward>(reward));
            }
            return Ok(rewards);
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
