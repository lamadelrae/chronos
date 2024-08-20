namespace Chronos.Api.Shared.Extensions;

public static class ExceptionExtensions
{
    public static string GetException(this System.Exception ex) => ex.InnerException is null ? ex.Message : GetException(ex.InnerException);
}