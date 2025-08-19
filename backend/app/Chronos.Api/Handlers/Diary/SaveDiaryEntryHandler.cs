using Chronos.Api.Data;
using Chronos.Api.Entities;
using Chronos.Api.Shared.Users;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Diary;

public interface ISaveDiaryEntryHandler
{
    Task Handle(Request request);

    public record Request(DateOnly Date, string Title, string Content);
}

public class SaveDiaryEntryHandler(Context context, IUserInfo userInfo) : ISaveDiaryEntryHandler
{
    private readonly Context _context = context;
    private readonly IUserInfo _userInfo = userInfo;

    public async Task Handle(ISaveDiaryEntryHandler.Request request)
    {
        Validate(request);

        var diaryEntry = new DiaryEntry
        {
            Id = Guid.NewGuid(),
            UserId = _userInfo.Id,
            CompanyId = _userInfo.CompanyId,
            Date = request.Date,
            Title = request.Title,
            Content = request.Content,
            CreatedAt = DateTime.UtcNow,
            LastUpdate = DateTime.UtcNow
        };

        await _context.Set<DiaryEntry>().AddAsync(diaryEntry);
        await _context.SaveChangesAsync();
    }

    private static void Validate(ISaveDiaryEntryHandler.Request request)
    {
        if (string.IsNullOrWhiteSpace(request.Title)) throw new ValidationException("Title cannot be empty.");
        if (string.IsNullOrWhiteSpace(request.Content)) throw new ValidationException("Content cannot be empty.");
        if (request.Title.Length > 200) throw new ValidationException("Title cannot exceed 200 characters.");
        if (request.Content.Length > 5000) throw new ValidationException("Content cannot exceed 5000 characters.");
    }
}