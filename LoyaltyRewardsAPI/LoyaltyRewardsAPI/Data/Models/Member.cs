﻿using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoyaltyRewardsAPI.Data.Models {
    public class Member {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Meta { get; set; } = string.Empty;

        public string BirthdayMonth { get; set; } = string.Empty;

        public int Points { get; set; }

        public string Flags { get; set; } = string.Empty;

        public long LastUpdatedTime { get; set; }

        public long AccountCreateTime { get; set; }

        public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();

        override public string ToString() {
            return $"{Id} : {Email}\n{AccountCreateTime} - {LastUpdatedTime}";
        }
    }

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
