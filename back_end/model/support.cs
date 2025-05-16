using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Models
{
    [Table("support")]
    public class Support
    {
        [Key]
        [StringLength(25)]
        [Column("support_id")]
        public string SupportId { get; set; }

        [Column("user_ask")]
        public int? UserAskId { get; set; }

        [StringLength(1000)]
        [Column("ask")]
        public string Ask { get; set; }

        [Column("date_ask")]
        public DateTime? DateAsk { get; set; }

        [StringLength(25)]
        [Column("product_id")]
        public string ProductId { get; set; }

        [StringLength(25)]
        [Column("order_id")]
        public string OrderId { get; set; }

        [Column("user_answer")]
        public int? UserAnswerId { get; set; }

        [StringLength(1000)]
        [Column("answer")]
        public string Answer { get; set; }

        [Column("date_answer")]
        public DateTime? DateAnswer { get; set; }

        [StringLength(25)]
        [Column("support_in")]
        public string SupportIn { get; set; }

        // Navigation properties
        [ForeignKey("UserAskId")]
        public User UserAsk { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }

        [ForeignKey("OrderId")]
        public Order Order { get; set; }

        [ForeignKey("UserAnswerId")]
        public User UserAnswer { get; set; }
    }
}