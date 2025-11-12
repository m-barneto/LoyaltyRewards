using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LoyaltyRewardsAPI.Data.Models.Management {
    public class Store {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string StoreName { get; set; } = string.Empty;

        public int DistrictId { get; set; }

        [ForeignKey("DistrictId")]
        public virtual District District { get; set; } = null!;
    }
}
