using System.Reflection;
using System.Text;

namespace Chronos.Api.Shared.Extensions;

public static class TypeExtensions
{
    public static string FriendlyId(this Type type)
    {
        var typeName = type.FullName?.Replace("+", ".");

        if (type.GetTypeInfo().IsGenericType)
        {
            var genericArgumentIds = type.GetGenericArguments()
                .Select(t => t.FriendlyId())
                .ToArray();

            var argumentToReplace = string.Format("`{0}", genericArgumentIds.Count());
            var argumentToAdd = string.Format("{0}", string.Join(string.Empty, genericArgumentIds));

            return new StringBuilder(typeName)
                .Replace(argumentToReplace, string.Empty)
                .Append(argumentToAdd)
                .ToString();
        }

        return typeName;
    }
}