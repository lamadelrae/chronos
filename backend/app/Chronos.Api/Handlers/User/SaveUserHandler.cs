using Chronos.Api.Data;
using Chronos.Api.Shared.Extensions;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.User;

public interface ISaveUserHandler
{
    Task Handle(Request request);

    public record Request(Guid CompanyId, string Name, string Email, string Password);
}

public class SaveUserHandler(Context context) : ISaveUserHandler
{
    private readonly Context _context = context;

    public async Task Handle(ISaveUserHandler.Request request)
    {
        Validate(request);

        var user = new Entities.User
        {
            CompanyId = request.CompanyId,
            Name = request.Name,
            Email = request.Email,
            Password = request.Password.ToSha256(),
            CreatedAt = DateTime.UtcNow,
        };

        await _context.Set<Entities.User>().AddAsync(user);
        await _context.SaveChangesAsync();
    }

    private static void Validate(ISaveUserHandler.Request request)
    {
        if (request.CompanyId == Guid.Empty) throw new ValidationException("CompanyId should be valid.");
        if (string.IsNullOrWhiteSpace(request.Name)) throw new ValidationException("Name cannot be empty.");
        if (string.IsNullOrWhiteSpace(request.Email)) throw new ValidationException("Email cannot be empty.");
        if (string.IsNullOrWhiteSpace(request.Password)) throw new ValidationException("Password cannot be empty.");
    }
}