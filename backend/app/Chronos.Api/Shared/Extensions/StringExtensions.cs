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

    public static string RemoveCnpjFormat(this string value)
    {
        return value
            .Replace(".", string.Empty)
            .Replace("/", string.Empty)
            .Replace("-", string.Empty);
    }

    public static bool IsValidCnpj(this string value)
    {
        value = value.RemoveCnpjFormat();

        if (value.Length != 14)
        {
            return false;
        }

        int[] multipliers1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        int[] multipliers2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        string tempCnpj = value[..12];
        int sum = 0;

        for (int i = 0; i < 12; i++)
        {
            sum += int.Parse(tempCnpj[i].ToString()) * multipliers1[i];
        }

        int remainder = (sum % 11);
        if (remainder < 2)
        {
            remainder = 0;
        }
        else
        {
            remainder = 11 - remainder;
        }

        string digit = remainder.ToString();
        tempCnpj += digit;
        sum = 0;

        for (int i = 0; i < 13; i++)
        {
            sum += int.Parse(tempCnpj[i].ToString()) * multipliers2[i];
        }

        remainder = (sum % 11);
        if (remainder < 2)
        {
            remainder = 0;
        }
        else
        {
            remainder = 11 - remainder;
        }

        digit += remainder.ToString();

        return value.EndsWith(digit);
    }
}
