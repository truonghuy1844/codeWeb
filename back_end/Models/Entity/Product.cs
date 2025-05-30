using System;
using System.Collections.Generic;

namespace back_end.Models.Entity
{
    

public partial class Product
{
    public string ProductId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Name2 { get; set; }

    public string? Description { get; set; }

    public string? BrandId { get; set; }

    public string CategoryId { get; set; } = null!;

    public string? GroupTb1 { get; set; }

    public string? GroupTb2 { get; set; }

    public string? GroupTb3 { get; set; }

    public string? GroupTb4 { get; set; }

    public string? Uom { get; set; }

    public decimal? Price1 { get; set; }

    public DateTime? DateApply1 { get; set; }

    public decimal? Price2 { get; set; }

    public DateTime? DateApply2 { get; set; }

    public string? UrlImage1 { get; set; }

    public string? UrlImage2 { get; set; }

    public string? UrlImage3 { get; set; }

    public int? UserId { get; set; }

    public bool? Status { get; set; }

    public virtual Brand? Brand { get; set; }

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<ClickProduct> ClickProducts { get; set; } = new List<ClickProduct>();

    public virtual GroupTb? GroupTb1Navigation { get; set; }

    public virtual GroupTb? GroupTb2Navigation { get; set; }

    public virtual GroupTb? GroupTb3Navigation { get; set; }

    public virtual GroupTb? GroupTb4Navigation { get; set; }

    public virtual ICollection<OrderD> OrderDs { get; set; } = new List<OrderD>();

    public virtual ICollection<ProductIn> ProductIns { get; set; } = new List<ProductIn>();

    public virtual ICollection<PromotionProduct> PromotionProducts { get; set; } = new List<PromotionProduct>();

    public virtual ICollection<Rating> Ratings { get; set; } = new List<Rating>();

    public virtual ICollection<ShipmentD> ShipmentDs { get; set; } = new List<ShipmentD>();

    public virtual ICollection<Support> Supports { get; set; } = new List<Support>();

    public virtual ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
}

}