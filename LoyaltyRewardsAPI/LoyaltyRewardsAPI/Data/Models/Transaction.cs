using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LoyaltyRewardsAPI.Data.Models {
    public class Transaction {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int MemberId { get; set; }
        [ForeignKey("MemberId")]
        public virtual Member Member { get; set; } = null!;

        public long Date { get; set; }

        public int PointsEarned { get; set; }

        public string Employee { get; set; } = null!;
    }

    public class PartialTransaction {
        public long? Date { get; set; }

        public int? PointsEarned { get; set; }

        public string? Employee { get; set; }
    }
}
