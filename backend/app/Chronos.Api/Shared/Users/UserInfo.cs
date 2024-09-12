namespace Chronos.Api.Shared.Users;

public interface IUserInfo
{
    public Guid Id { get; }
    public Guid CompanyId { get; }
};

public class UserInfo : IUserInfo
{
    public Guid Id { get; set; }
    public Guid CompanyId { get; set; }

    public UserInfo(IHttpContextAccessor accessor)
    {
        var id = accessor.HttpContext!.User.FindFirst("id")?.Value;
        if (!string.IsNullOrWhiteSpace(id))
        {
            Id = Guid.Parse(id);
        }

        var companyId = accessor.HttpContext!.User.FindFirst("companyId")?.Value;
        if (!string.IsNullOrWhiteSpace(companyId))
        {
            CompanyId = Guid.Parse(companyId);
        }
    }
}