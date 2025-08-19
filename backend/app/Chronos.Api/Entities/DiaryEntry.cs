using Chronos.Api.Entities.Base;

namespace Chronos.Api.Entities;

public class DiaryEntry : Entity
{
    public Guid UserId { get; set; }
    public Guid CompanyId { get; set; }
    public DateOnly Date { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;

    public User User { get; set; } = null!;
    public Company Company { get; set; } = null!;
}