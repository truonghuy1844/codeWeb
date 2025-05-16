using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back_end.Models
{
    [Table("log_hisory")]
    public class LogHistory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LogId { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }

        [Column("date_log")]
        public DateTime? DateLog { get; set; }

        [StringLength(50)]
        [Column("IP")]
        public string IP { get; set; }

        [Column("status")]
        public int? Status { get; set; }

        // Navigation property
        [ForeignKey("UserId")]
        public User User { get; set; }
    }

    [Table("change_history")]
    public class ChangeHistory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ChangeId { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }

        [Column("date_act")]
        public DateTime? DateAct { get; set; }

        [StringLength(25)]
        [Column("type")]
        public string Type { get; set; }

        [StringLength(25)]
        [Column("table_change")]
        public string TableChange { get; set; }

        [Column("old_val")]
        public string OldValue { get; set; }

        [Column("new_val")]
        public string NewValue { get; set; }

        [Column("status")]
        public int? Status { get; set; }

        // Navigation property
        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}