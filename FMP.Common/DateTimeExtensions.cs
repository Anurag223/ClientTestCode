using System;
using System.Globalization;

namespace FMP.Common
{
    public static class DateTimeExtensions
    {
        public static bool IsValidTimeFormat(this string input)
        {
            return DateTime.TryParse(input, out DateTime output);
        }

        public static DateTime ChangeToUTCTimeZone(this string input)
        {
            return DateTime.Parse(input).ToUniversalTime();
        }
    }
}
