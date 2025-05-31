using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Models.Entity
{
public partial class User
{
    public int UserId { get; set; }

    public string UserName { get; set; } = null!;

    public string Password { get; set; } = null!;

    [Column("admin")]
    public bool IsAdmin { get; set; }

    [Column("buyer")]
    public bool IsBuyer { get; set; }

    [Column("seller")]
    public bool IsSeller { get; set; }

    public int Rank { get; set; }

    [Column("ban")]
    public bool IsBanned { get; set; }

    //[Column("phong_ban")]
    //public string? Department { get; set; }

    [Column("freeze")]
    public bool IsFrozen { get; set; }

    [Column("notify")]
    public bool IsNotify { get; set; } = true;

    public DateOnly? DateCreated { get; set; }

    public bool? Status { get; set; } = true;

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual ICollection<ChatMember> ChatMembers { get; set; } = new List<ChatMember>();

    public virtual ICollection<ClickProduct> ClickProducts { get; set; } = new List<ClickProduct>();

    public virtual ICollection<Rating> Ratings { get; set; } = new List<Rating>();

    public virtual ICollection<Support> SupportUserAnswerNavigations { get; set; } = new List<Support>();

    public virtual ICollection<Support> SupportUserAskNavigations { get; set; } = new List<Support>();

    public virtual UserDetails? UserDetails { get; set; }

    public virtual ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
}

}

