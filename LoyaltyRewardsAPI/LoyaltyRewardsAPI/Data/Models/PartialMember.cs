﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LoyaltyRewardsAPI.Data.Models {
    public class PartialMember {
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Email { get; set; }

        public int? Points { get; set; }
    }
}
