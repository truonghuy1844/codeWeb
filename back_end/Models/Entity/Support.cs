using System;
using System.Collections.Generic;

namespace back_end.Models.Entity;

public partial class Support
{
    public string SupportId { get; set; } = null!;

    public int? UserAsk { get; set; }

    public string? Ask { get; set; }

    public DateTime? DateAsk { get; set; }

    public string? ProductId { get; set; }

    public string? OrderId { get; set; }

    public int? UserAnswer { get; set; }

    public string? Answer { get; set; }

    public DateTime? DateAnswer { get; set; }

    public string? SupportIn { get; set; }

    public virtual OrderTb? Order { get; set; }

    public virtual Product? Product { get; set; }

    public virtual User? UserAnswerNavigation { get; set; }

    public virtual User? UserAskNavigation { get; set; }
}
