using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoyaltyRewardsAPI.Data.Models {
    public class Member {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public int Points { get; set; }

        public long LastUpdatedTime { get; set; }

        public long AccountCreateTime { get; set; }

        override public string ToString() {
            return $"{Id} : {Email}\n{AccountCreateTime} - {LastUpdatedTime}";
        }
    }
}
