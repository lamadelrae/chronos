namespace Chronos.Integration.Etrade.Shared.Extensions;

public static class IEnumerableExtensions
{
    public static List<List<T>> ToBatchesOf<T>(this IEnumerable<T> items, int batchSize)
    {
        ArgumentNullException.ThrowIfNull(items);

        if (batchSize <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(batchSize), "Batch size must be greater than 0.");
        }

        var batches = new List<List<T>>();

        for (var i = 0; i < items.Count(); i += batchSize)
        {
            List<T> batch = items.Skip(i).Take(batchSize).ToList();
            batches.Add(batch);
        }

        return batches;
    }
}