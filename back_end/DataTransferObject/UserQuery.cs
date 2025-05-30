namespace back_end.DataTransferObject;

public class UserQuery : BaseQuery
{
    public string? Department { get; set; }
    public bool? Status { get; set; }
}