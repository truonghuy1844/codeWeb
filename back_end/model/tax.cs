using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Models
{
    [Table("tax")]
    public class Tax
    {
        [Key]
        [StringLength(25)]
        [Column("tax_id")]
        public string TaxId { get; set; }

        [Column("seq_num")]
        public int? SequenceNumber { get; set; }

        [StringLength(75)]
        [Column("tax_name")]
        public string TaxName { get; set; }

        [StringLength(75)]
        [Column("tax_name2")]
        public string TaxName2 { get; set; }

        [Column("date_created")]
        public DateTime? DateCreated { get; set; }

        [Column("date_start")]
        public DateTime? DateStart { get; set; }

        [Column("date_end")]
        public DateTime? DateEnd { get; set; }

        [StringLength(1000)]
        [Column("description")]
        public string Description { get; set; }

        [Column("rate")]
        public decimal? Rate { get; set; }

        [Column("quan_cond")]
        public int? QuantityCondition { get; set; }

        [Column("val_cond")]
        public decimal? ValueCondition { get; set; }

        [StringLength(25)]
        [Column("group_tb_cond")]
        public string GroupCondition { get; set; }

        [Column("rank_cond")]
        public int? RankCondition { get; set; }

        [Column("status")]
        public bool Status { get; set; } = true;

        // Navigation property
        public ICollection<OrderDetail> OrderDetails { get; set; }
    }
}