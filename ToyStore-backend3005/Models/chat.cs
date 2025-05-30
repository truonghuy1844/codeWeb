using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToyStore.Models
{
 [Table("chat_tab")]
    public class Chat
    {
        [Key]
        [StringLength(25)]
        [Column("chat_id")]
        public string ChatId { get; set; }

        [Column("date_created")]
        public DateTime? DateCreated { get; set; }

        [StringLength(75)]
        [Column("name")]
        public string Name { get; set; }
    }

    [Table("chat_member")]
    public class ChatMember
    {
        [Key]
        [Column("member_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MemberId { get; set; }

        [StringLength(75)]
        [Column("member_name")]
        public string MemberName { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }

        [StringLength(25)]
        [Column("chat_id")]
        public string ChatId { get; set; }

        [Column("date_joined")]
        public DateTime? DateJoined { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public User User { get; set; }

        [ForeignKey("ChatId")]
        public Chat Chat { get; set; }
    }

    [Table("chat_detail")]
    public class ChatDetail
    {
        [Key]
        [Column("chat_rec")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ChatRecordId { get; set; }

        [Column("member_send")]
        public int MemberSendId { get; set; }

        [Column("name_send")]
        public int? NameSend { get; set; }

        [Column("msg_txt")]
        public string MessageText { get; set; }

        [Column("date_created")]
        public DateTime? DateCreated { get; set; }

        [Column("chat_reply")]
        public int? ChatReplyId { get; set; }

        [Column("member_reply")]
        public int? MemberReplyId { get; set; }

        [Column("isRead")]
        public bool? IsRead { get; set; }

        [Column("pin")]
        public bool? IsPinned { get; set; }
    }
}
