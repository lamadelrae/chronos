using Chronos.Api.Data;
using Chronos.Api.Entities;
using Chronos.Api.Shared.Users;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Chronos.Api.Handlers.Diary;

public interface IDeleteDiaryEntryHandler
{
    Task Handle(Request request);

    public record Request(Guid Id);
}

public class DeleteDiaryEntryHandler(Context context, IUserInfo userInfo) : IDeleteDiaryEntryHandler
{
    private readonly Context _context = context;
    private readonly IUserInfo _userInfo = userInfo;

    public async Task Handle(IDeleteDiaryEntryHandler.Request request)
    {
        Validate(request);

        var diaryEntry = await _context.Set<DiaryEntry>()
            .FirstOrDefaultAsync(x => x.Id == request.Id && x.CompanyId == _userInfo.CompanyId);

        if (diaryEntry == null)
            throw new ValidationException("Diary entry not found.");

        _context.Set<DiaryEntry>().Remove(diaryEntry);
        await _context.SaveChangesAsync();
    }

    private static void Validate(IDeleteDiaryEntryHandler.Request request)
    {
        if (request.Id == Guid.Empty) throw new ValidationException("Id should be valid.");
    }
}