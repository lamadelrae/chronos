namespace Chronos.Api.Shared.Responses;

public record PaginatedResponse<TResponse> where TResponse : class
{
    public IEnumerable<TResponse> Data { get; private set; } = [];
    public int TotalItems { get; private set; }
    public int PageCount { get; private set; }
    public int PageSize { get; private set; }
    public int CurrentPage { get; private set; }

    public PaginatedResponse(int currentPage, int pageSize)
    {
        CurrentPage = currentPage;
        PageSize = pageSize;
    }

    public PaginatedResponse<TResponse> SetData(IEnumerable<TResponse> value)
    {
        Data = value;
        return this;
    }

    public PaginatedResponse<TResponse> SetTotalItems(int value)
    {
        TotalItems = value;
        PageCount = (int)Math.Ceiling((decimal)TotalItems / PageSize);
        return this;
    }
}
