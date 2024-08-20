using Chronos.Api.Data;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.User;

public interface IDeleteUserHandler
{
    Task Handle(Request request);

    public record Request(Guid UserId);
}

public class DeleteUserHandler(Context context) : IDeleteUserHandler
{
    private readonly Context _context = context;

    public async Task Handle(IDeleteUserHandler.Request request)
    {
        Validate(request);

        var user = await _context.Set<Entities.User>().FindAsync(request.UserId) ?? throw new ValidationException("User not found.");
        _context.Set<Entities.User>().Remove(user);
        await _context.SaveChangesAsync();
    }

    private static void Validate(IDeleteUserHandler.Request request)
    {
        if (request.UserId == Guid.Empty) throw new ValidationException("UserId should be valid.");
    }
}
