using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Banner
    {
        public int Id { get; set; }
        public int UserId { get; set; }  

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        [Required]
        public string ClientLink { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Required]
        public Position Position { get; set; }

        [Required]
        public int DisplayOrder { get; set; }

        [Required]
        public RenewalType RenewalType { get; set; }

        public RenewalPeriod? AutoRenewalPeriod { get; set; }
    }

}
