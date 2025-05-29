using System;
using System.Collections.Generic;

namespace back_end.Models.Entity;

public partial class ChatMember
{
    public int MemberId { get; set; }

    public string? MemberName { get; set; }

    public int? UserId { get; set; }

    public string? ChatId { get; set; }

    public DateTime? DateJoined { get; set; }

    public virtual ChatTab? Chat { get; set; }

    public virtual User? User { get; set; }
}
