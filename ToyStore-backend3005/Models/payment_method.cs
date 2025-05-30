using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToyStore.Models
{
[Table("payment_method")]
    public class PaymentMethod
    {
        [Key]
        [StringLength(25)]
        [Column("method_id")]
        public string MethodId { get; set; }

        [StringLength(75)]
        [Column("name")]
        public string Name { get; set; }

        [Column("type")]
        public int? Type { get; set; }

        [StringLength(1000)]
        [Column("description")]
        public string Description { get; set; }

        [Column("date_created")]
        public DateTime? DateCreated { get; set; }

        [Column("fee_rate")]
        public int? FeeRate { get; set; }

        [StringLength(200)]
        [Column("url")]
        public string Url { get; set; }

        [StringLength(200)]
        [Column("logo_url")]
        public string LogoUrl { get; set; }

        [StringLength(100)]
        [Column("bank")]
        public string Bank { get; set; }

        [Column("num_account")]
        public int? AccountNumber { get; set; }

        [StringLength(75)]
        [Column("name_account")]
        public string AccountName { get; set; }

        [Column("refund")]
        public bool? Refund { get; set; }

        [Column("sort")]
        public int? Sort { get; set; }

        [Column("status")]
        public bool Status { get; set; } = true;

        // Navigation property
        public ICollection<Invoice> Invoices { get; set; }
    }
}