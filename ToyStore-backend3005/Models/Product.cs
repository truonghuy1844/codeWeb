using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using ToyStore.Models;

namespace ToyStore.Models
{
    [Table("product")]
    public class Product
    {
        [Key]
        [Column("product_id")]
        [StringLength(25)]
        public string ProductId { get; set; }

        [Column("name")]
        public string Name { get; set; } = null!;

        [Column("description")]
        public string? Description { get; set; }

        [Column("brand_id")]
        public string? BrandId { get; set; }

        [ForeignKey("BrandId")]
        [JsonIgnore]
        public Brand? Brand { get; set; }

        [Column("category_id")]
        public string CategoryId { get; set; } = null!;

        [Column("url_image1")]
        public string? UrlImage1 { get; set; }

        [Column("url_image2")]
        public string? UrlImage2 { get; set; }

        [Column("url_image3")]
        public string? UrlImage3 { get; set; }

        [Column("price1")]
        public decimal? Price1 { get; set; }
        [Column("price2")]
        public decimal? Price2 { get; set; }

        [Column("status")]
        public bool? Status { get; set; }

        [Column("group_tb_1")]
        public string? GroupId1 { get; set; }

        [Column("group_tb_2")]
        public string? GroupId2 { get; set; }

        [Column("group_tb_3")]
        public string? GroupId3 { get; set; }

        [Column("group_tb_4")]
        public string? GroupId4 { get; set; }

        [ForeignKey("GroupId1")]
        public Group? Group1 { get; set; }

        [ForeignKey("GroupId2")]
        public Group? Group2 { get; set; }

        [ForeignKey("GroupId3")]
        public Group? Group3 { get; set; }

        [ForeignKey("GroupId4")]
        public Group? Group4 { get; set; }

        public ICollection<Cart> Carts { get; set; }
        public Category? Category { get; set; }

    }
}
