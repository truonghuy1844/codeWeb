using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Models
{
    [Table("user_tb")]
    public class User
    {
        [Key]
        [Column("user_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }

        [Required]
        [StringLength(25)]
        [Column("user_name")]
        public string UserName { get; set; }

        [Required]
        [StringLength(100)]
        [Column("password")]
        public string Password { get; set; }

        [Column("admin")]
        public bool IsAdmin { get; set; }

        [Column("buyer")]
        public bool IsBuyer { get; set; } = true;

        [Column("seller")]
        public bool IsSeller { get; set; }

        [Column("rank")]
        public int Rank { get; set; }

        [Column("ban")]
        public bool IsBanned { get; set; }

        [Column("freeze")]
        public bool IsFrozen { get; set; }

        [Column("notify")]
        public bool Notify { get; set; }

        [Column("date_created")]
        public DateTime? DateCreated { get; set; }

        [Column("status")]
        public bool Status { get; set; } = true;

        // Navigation properties
        public UserDetails UserDetails { get; set; }
        public ICollection<Cart> Carts { get; set; }
        public ICollection<Wishlist> Wishlists { get; set; }
        public ICollection<Rating> Ratings { get; set; }
        public ICollection<LogHistory> LogHistories { get; set; }
        public ICollection<ChangeHistory> ChangeHistories { get; set; }
        public ICollection<Support> SupportsAsked { get; set; }
        public ICollection<Support> SupportsAnswered { get; set; }
        public ICollection<ChatMember> ChatMembers { get; set; }
        public ICollection<ClickProduct> ClickProducts { get; set; }
    }

    [Table("user_tb2")]
    public class UserDetails
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }

        [StringLength(50)]
        [Column("name")]
        public string Name { get; set; }

        [StringLength(50)]
        [Column("name2")]
        public string Name2 { get; set; }

        [Column("birthday")]
        public DateTime? Birthday { get; set; }

        [StringLength(10)]
        [Column("phone_number")]
        public string PhoneNumber { get; set; }

        [StringLength(200)]
        [Column("address")]
        public string Address { get; set; }

        [StringLength(50)]
        [Column("email")]
        public string Email { get; set; }

        [StringLength(300)]
        [Column("social_url1")]
        public string SocialUrl1 { get; set; }

        [StringLength(300)]
        [Column("social_url2")]
        public string SocialUrl2 { get; set; }

        [StringLength(300)]
        [Column("social_url3")]
        public string SocialUrl3 { get; set; }

        [Column("logo_url")]
        public string LogoUrl { get; set; }

        // Navigation property
        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}