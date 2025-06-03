
public class CreateAddressDto
{
    public string? City { get; set; }
    public string? District { get; set; }
    public string? Ward { get; set; }
    public string? Street { get; set; }
    public string? Detail { get; set; }
    public int? UserId { get; set; }
    public bool? Status { get; set; }
    public string Name { get; set; }       
    public string Phone { get; set; }
}

public class AddressDto : CreateAddressDto
{
    public string AddressId { get; set; } = null!;
}