using System;
using System.Collections.Generic;

namespace back_end.Models.Entity;

public partial class UserDetails
{
    public int UserId { get; set; }

    public string? Name { get; set; }

    public string? Name2 { get; set; }

    public DateOnly? Birthday { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Address { get; set; }

    public string? Email { get; set; }

    public string? SocialUrl1 { get; set; }

    public string? SocialUrl2 { get; set; }

    public string? SocialUrl3 { get; set; }

    public string? LogoUrl { get; set; }

    public virtual User User { get; set; } = null!;
}
