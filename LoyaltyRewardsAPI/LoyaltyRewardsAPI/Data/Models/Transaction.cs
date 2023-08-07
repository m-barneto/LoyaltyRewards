﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LoyaltyRewardsAPI.Data.Models {
    public class Transaction {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int MemberId { get; set; }

        public string Date { get; set; } = null!;

        public int PointsEarned { get; set; }
    }
}