using System;
using System.Collections.Generic;

namespace back_end.Models.Entity;

public partial class ChatTab
{
    public string ChatId { get; set; } = null!;

    public DateTime? DateCreated { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<ChatMember> ChatMembers { get; set; } = new List<ChatMember>();
}
