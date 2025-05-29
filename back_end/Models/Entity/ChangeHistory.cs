using System;
using System.Collections.Generic;

namespace back_end.Models.Entity;

public partial class ChangeHistory
{
    public int? UserId { get; set; }

    public DateTime? DateAct { get; set; }

    public string? Type { get; set; }

    public string? TableChange { get; set; }

    public string? OldVal { get; set; }

    public string? NewVal { get; set; }

    public int? Status { get; set; }

    public virtual User? User { get; set; }
}
