using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LoyaltyRewardsAPI.Data.Models {
    public class PartialMember {
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Email { get; set; }

        public string? Meta { get; set; }

        public string? BirthdayMonth { get; set; }

        public int? Points { get; set; }

        public string? Flags { get; set; }
    }
}
