using Chronos.Api.Data;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.User;

public interface IFetchUserHandler
{
    Task<Response> Handle(Request request);

    public record Request(Guid UserId);

    public record Response(Guid UserId, Guid CompanyId, string Name, string Email);
}

public class FetchUserHandler(Context context) : IFetchUserHandler
{
    private readonly Context _context = context;

    public async Task<IFetchUserHandler.Response> Handle(IFetchUserHandler.Request request)
    {
        Validate(request);

        var user = await _context.Set<Entities.User>().FindAsync(request.UserId) ?? throw new ValidationException("User not found.");
        return new IFetchUserHandler.Response(user.Id, user.CompanyId, user.Name, user.Email);
    }

    private static void Validate(IFetchUserHandler.Request request)
    {
        if (request.UserId == Guid.Empty) throw new ValidationException("UserId should be valid.");
    }
}
