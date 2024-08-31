using Chronos.Api.Data;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.User;

public interface IUpdateUserHandler
{
    Task Handle(Request request);

    public record Request(Guid UserId, string Name, string Email);
}

public class UpdateUserHandler(Context context) : IUpdateUserHandler
{
    private readonly Context _context = context;

    public async Task Handle(IUpdateUserHandler.Request request)
    {
        Validate(request);

        var user = await _context.Set<Entities.User>().FindAsync(request.UserId) ?? throw new ValidationException("User not found.");
        user.Name = request.Name;
        user.Email = request.Email;
        user.LastUpdate = DateTime.Now;

        _context.Set<Entities.User>().Update(user);
        await _context.SaveChangesAsync();
    }

    private static void Validate(IUpdateUserHandler.Request request)
    {
        if (request.UserId == Guid.Empty) throw new ValidationException("UserId should be valid.");
        if (string.IsNullOrWhiteSpace(request.Name)) throw new ValidationException("Name cannot be empty.");
        if (string.IsNullOrWhiteSpace(request.Email)) throw new ValidationException("Email cannot be empty.");
    }
}
