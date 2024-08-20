using System.Security.Cryptography;
using System.Text;

namespace Chronos.Api.Shared.Extensions;

public static class StringExtensions
{
    public static string ToSha256(this string value)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(value));

        var builder = new StringBuilder();
        for (int i = 0; i < bytes.Length; i++)
        {
            builder.Append(bytes[i].ToString("x2"));
        }

        return builder.ToString();
    }
}
