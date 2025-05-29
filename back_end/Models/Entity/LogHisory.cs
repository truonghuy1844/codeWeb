using System;
using System.Collections.Generic;

namespace back_end.Models.Entity;

public partial class LogHisory
{
    public int? UserId { get; set; }

    public DateTime? DateLog { get; set; }

    public string? Ip { get; set; }

    public int? Status { get; set; }

    public virtual User? User { get; set; }
}
