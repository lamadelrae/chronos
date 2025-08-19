using Chronos.Api.Data;
using Chronos.Api.Entities;
using Chronos.Api.Shared.Users;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Diary;

public interface IUpdateDiaryEntryHandler
{
    Task Handle(Request request);

    public record Request(Guid Id, string Title, string Content);
}

public class UpdateDiaryEntryHandler(Context context, IUserInfo userInfo) : IUpdateDiaryEntryHandler
{
    private readonly Context _context = context;
    private readonly IUserInfo _userInfo = userInfo;

    public async Task Handle(IUpdateDiaryEntryHandler.Request request)
    {
        Validate(request);

        var diaryEntry = await _context.Set<DiaryEntry>()
            .FirstOrDefaultAsync(x => x.Id == request.Id && x.CompanyId == _userInfo.CompanyId);

        if (diaryEntry == null)
            throw new ValidationException("Diary entry not found.");

        diaryEntry.Title = request.Title;
        diaryEntry.Content = request.Content;
        diaryEntry.LastUpdate = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    private static void Validate(IUpdateDiaryEntryHandler.Request request)
    {
        if (request.Id == Guid.Empty) throw new ValidationException("Id should be valid.");
        if (string.IsNullOrWhiteSpace(request.Title)) throw new ValidationException("Title cannot be empty.");
        if (string.IsNullOrWhiteSpace(request.Content)) throw new ValidationException("Content cannot be empty.");
        if (request.Title.Length > 200) throw new ValidationException("Title cannot exceed 200 characters.");
        if (request.Content.Length > 5000) throw new ValidationException("Content cannot exceed 5000 characters.");
    }
}