using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToyStore.Models
{
    [Table("group_tb")]
    public class Group
    {
        [Key]
        [StringLength(25)]
        [Column("group_tb_id")]
        public string GroupId { get; set; } = null!;

        [Required]
        [StringLength(75)]
        [Column("group_tb_name")]
        public string GroupName { get; set; } = null!;

        [StringLength(75)]
        [Column("group_tb_name2")]
        public string? GroupName2 { get; set; }

        [Column("type")]
        public int? Type { get; set; }

        [StringLength(1000)]
        [Column("description")]
        public string? Description { get; set; }

        [Column("status")]
        public bool Status { get; set; } = true;

        [InverseProperty("Group1")]
        public ICollection<Product> ProductsGroup1 { get; set; } = new List<Product>();

        [InverseProperty("Group2")]
        public ICollection<Product> ProductsGroup2 { get; set; } = new List<Product>();

        [InverseProperty("Group3")]
        public ICollection<Product> ProductsGroup3 { get; set; } = new List<Product>();

        [InverseProperty("Group4")]
        public ICollection<Product> ProductsGroup4 { get; set; } = new List<Product>();
    }
}
