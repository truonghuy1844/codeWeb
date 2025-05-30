using System;
using System.Collections.Generic;

namespace back_end.Models.Entity
{
    public partial class ChatDetail
{
    public int ChatRec { get; set; }

    public int MemberSend { get; set; }

    public int? NameSend { get; set; }

    public string? MsgTxt { get; set; }

    public DateTime? DateCreated { get; set; }

    public int? ChatReply { get; set; }

    public int? MemberReply { get; set; }

    public bool? IsRead { get; set; }

    public bool? Pin { get; set; }
}

}

