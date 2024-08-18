using Chronos.Api.Data;
using Chronos.Api.Shared.Responses;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.User;

public interface IFetchUsersHandler
{
    Task<PaginatedResponse<Response>> Handle(Request request);

    public record Request(int Page, int Size, Guid? Id);

    public record Response(Guid Id, Guid CompanyId, string Name, string Email);
}

public class FetchUsersHandler(Context context) : IFetchUsersHandler
{
    public async Task<PaginatedResponse<IFetchUsersHandler.Response>> Handle(IFetchUsersHandler.Request request)
    {
        Validate(request);

        var users = await context.Set<Entities.User>()
            .Skip(request.Page * request.Size)
            .Take(request.Size)
            .Where(user => request.Id == null || user.Id == request.Id)
            .Select(user => new IFetchUsersHandler.Response(user.Id, user.CompanyId, user.Name, user.Email))
            .ToListAsync();

        var count = await context.Set<Entities.User>().CountAsync();

        return new PaginatedResponse<IFetchUsersHandler.Response>(request.Page, request.Size)
            .SetData(users)
            .SetTotalItems(count);
    }

    private static void Validate(IFetchUsersHandler.Request request)
    {
        if (request.Id == Guid.Empty) throw new ValidationException("UserId should be valid.");
    }
}
