using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LoyaltyRewardsAPI.Data.Models.Management {
    public class Organization {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string OrganizationName { get; set; } = string.Empty;

        public virtual ICollection<District> Districts { get; set; } = new List<District>();
    }
}
