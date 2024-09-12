using Chronos.Api.Data;
using Chronos.Api.Shared.Users;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.User;

public interface IFetchCurrentUserHandler
{
    Task<Response> Handle();
    public record Response(Guid Id, Guid CompanyId, string Name, string Email);
}

public class FetchCurrentUserHandler(Context context, IUserInfo userInfo) : IFetchCurrentUserHandler
{
    public async Task<IFetchCurrentUserHandler.Response> Handle()
    {
        var user = await context.Set<Entities.User>()
            .FirstOrDefaultAsync(user => user.Id == userInfo.Id)
            ?? throw new ValidationException("User not found.");

        return new IFetchCurrentUserHandler.Response(user.Id, user.CompanyId, user.Name, user.Email);
    }
}
