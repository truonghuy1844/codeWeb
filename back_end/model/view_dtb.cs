using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Models
{
    /// <summary>
    /// Represents the vw_product_inventory view in the database
    /// </summary>
    [Table("vw_product_inventory")]
    public class ProductInventory
    {
        [Key]
        public int product_id { get; set; }
        public string name { get; set; }
        public string name2 { get; set; }
        public string description { get; set; }
        public int? brand_id { get; set; }
        public int? category_id { get; set; }
        public string group_tb_1 { get; set; }
        public string group_tb_2 { get; set; }
        public string group_tb_3 { get; set; }
        public string group_tb_4 { get; set; }
        public decimal price { get; set; }
        public string url_image1 { get; set; }
        public string url_image2 { get; set; }
        public string url_image3 { get; set; }
        public string uom { get; set; }
        public string pro_status { get; set; }
        public string brand_status { get; set; }
        public int quantity_in { get; set; }
        public int quantity_sold { get; set; }
        public int quantity_available { get; set; }
    }

    /// <summary>
    /// Represents the vw_product_seller view in the database
    /// </summary>
    [Table("vw_product_seller")]
    public class ProductSeller
    {
        [Key]
        public int product_id { get; set; }
        public string name { get; set; }
        public string name2 { get; set; }
        public string description { get; set; }
        public int? brand_id { get; set; }
        public int? category_id { get; set; }
        public string group_tb_1 { get; set; }
        public string group_tb_2 { get; set; }
        public string group_tb_3 { get; set; }
        public string group_tb_4 { get; set; }
        public decimal price1 { get; set; }
        public decimal? price2 { get; set; }
        public decimal? price3 { get; set; }
        public string url_image1 { get; set; }
        public string url_image2 { get; set; }
        public string url_image3 { get; set; }
        public string uom { get; set; }
        public string status { get; set; }
        // Additional fields from the product table would go here
    }

    /// <summary>
    /// Represents the vw_brand view in the database
    /// </summary>
    [Table("vw_brand")]
    public class Brand
    {
        [Key]
        public int brand_id { get; set; }
        public string name { get; set; }
        public string name2 { get; set; }
        public string description { get; set; }
        public string url_image { get; set; }
        public string status { get; set; }
        // Additional fields from the brand table would go here
    }

    /// <summary>
    /// Represents the vw_user view in the database
    /// </summary>
    [Table("vw_user")]
    public class User
    {
        [Key]
        public int user_id { get; set; }
        public string user_name { get; set; }
        public string password { get; set; }
        public string status { get; set; }
        public string role { get; set; }
        public string name { get; set; }
        public string name2 { get; set; }
        public DateTime? birthday { get; set; }
        public string phone_number { get; set; }
        public string address { get; set; }
        public string email { get; set; }
        public string social_url1 { get; set; }
        public string social_url2 { get; set; }
        public string social_url3 { get; set; }
        public string logo_url { get; set; }
    }

    /// <summary>
    /// Represents the vw_promotion_detail view in the database
    /// </summary>
    [Table("vw_promotion_detail")]
    public class PromotionDetail
    {
        [Key]
        public int product_id { get; set; }
        public int promotion_id { get; set; }
        public string name { get; set; }
        public string name2 { get; set; }
        public string description { get; set; }
        public string promotion_type { get; set; }
        public decimal value { get; set; }
        public DateTime? effective_date { get; set; }
        public DateTime? expiry_date { get; set; }
        public int? quantity { get; set; }
        public string status { get; set; }
        public string detail_status { get; set; }
    }

    /// <summary>
    /// Represents the vw_promotion_used view in the database
    /// </summary>
    [Table("vw_promotion_used")]
    public class PromotionUsed
    {
        [Key]
        public int promotion_id { get; set; }
        // Includes all fields from vw_promotion_detail
        public int product_id { get; set; }
        public string name { get; set; }
        public string name2 { get; set; }
        public string description { get; set; }
        public string promotion_type { get; set; }
        public decimal value { get; set; }
        public DateTime? effective_date { get; set; }
        public DateTime? expiry_date { get; set; }
        public string status { get; set; }
        public string detail_status { get; set; }
        
        // Additional fields specific to vw_promotion_used
        public int quantity_total { get; set; }
        public int quantity_used { get; set; }
        public int quantity_available { get; set; }
    }

    /// <summary>
    /// Represents the vw_wishlist_detail view in the database
    /// </summary>
    [Table("vw_wishlist_detail")]
    public class WishlistDetail
    {
        [Key]
        [Column(Order = 0)]
        public int user_id { get; set; }
        
        [Key]
        [Column(Order = 1)]
        public int product_id { get; set; }
        
        public string user_name { get; set; }
        public string product_name { get; set; }
        public string product_description { get; set; }
        public int? brand_id { get; set; }
        public int? category_id { get; set; }
        public string group_tb_1 { get; set; }
        public string group_tb_2 { get; set; }
        public string group_tb_3 { get; set; }
        public string group_tb_4 { get; set; }
        public decimal price1 { get; set; }
        public string url_image1 { get; set; }
        public string status { get; set; }
    }

    /// <summary>
    /// Represents the vw_cart_detail view in the database
    /// </summary>
    [Table("vw_cart_detail")]
    public class CartDetail
    {
        [Key]
        [Column(Order = 0)]
        public int user_id { get; set; }
        
        [Key]
        [Column(Order = 1)]
        public int product_id { get; set; }
        
        public string user_name { get; set; }
        public string product_name { get; set; }
        public string description { get; set; }
        public int quantity { get; set; }
        public decimal price { get; set; }
        public decimal total_price { get; set; }
        public int? category_id { get; set; }
        public int? brand_id { get; set; }
        public string group_tb_1 { get; set; }
        public string group_tb_2 { get; set; }
        public string url_image1 { get; set; }
        public string status { get; set; }
    }
}