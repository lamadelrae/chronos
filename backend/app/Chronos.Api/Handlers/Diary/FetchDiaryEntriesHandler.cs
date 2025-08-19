using Chronos.Api.Data;
using Chronos.Api.Entities;
using Chronos.Api.Shared.Users;
using Microsoft.EntityFrameworkCore;

namespace Chronos.Api.Handlers.Diary;

public interface IFetchDiaryEntriesHandler
{
    Task<IEnumerable<Response>> Handle(DateOnly? date = null);

    public record Response(Guid Id, DateOnly Date, string Title, string Content, DateTime CreatedAt, DateTime LastUpdate);
}

public class FetchDiaryEntriesHandler(Context context, IUserInfo userInfo) : IFetchDiaryEntriesHandler
{
    private readonly Context _context = context;
    private readonly IUserInfo _userInfo = userInfo;

    public async Task<IEnumerable<IFetchDiaryEntriesHandler.Response>> Handle(DateOnly? date = null)
    {
        var query = _context.Set<DiaryEntry>()
            .Where(x => x.CompanyId == _userInfo.CompanyId);

        if (date.HasValue)
        {
            query = query.Where(x => x.Date == date.Value);
        }

        var entries = await query
            .OrderByDescending(x => x.Date)
            .ThenByDescending(x => x.CreatedAt)
            .Select(x => new IFetchDiaryEntriesHandler.Response(
                x.Id,
                x.Date,
                x.Title,
                x.Content,
                x.CreatedAt,
                x.LastUpdate))
            .ToListAsync();

        return entries;
    }
}