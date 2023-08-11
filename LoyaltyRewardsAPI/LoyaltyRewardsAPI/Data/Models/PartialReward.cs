using System.ComponentModel.DataAnnotations;

namespace LoyaltyRewardsAPI.Data.Models {
    public class PartialReward {
        public string? Description { get; set; }

        public int? PointCost { get; set; }
    }
}
