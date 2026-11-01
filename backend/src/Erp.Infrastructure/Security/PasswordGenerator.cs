using System.Security.Cryptography;

namespace Erp.Infrastructure.Security;

/// <summary>Cryptographically random passwords with at least one upper, lower, digit and symbol.</summary>
public static class PasswordGenerator
{
    // Ambiguous characters (0/O, 1/l/I) are left out so a password read aloud or copied by hand still works.
    private const string Upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    private const string Lower = "abcdefghijkmnpqrstuvwxyz";
    private const string Digits = "23456789";
    private const string Symbols = "@#$%&*!?";

    public static string Generate(int length = 14)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(length, 8);

        const string all = Upper + Lower + Digits + Symbols;
        var chars = new char[length];
        chars[0] = Pick(Upper);
        chars[1] = Pick(Lower);
        chars[2] = Pick(Digits);
        chars[3] = Pick(Symbols);
        for (var i = 4; i < length; i++) chars[i] = Pick(all);

        RandomNumberGenerator.Shuffle(chars.AsSpan());
        return new string(chars);
    }

    private static char Pick(string set) => set[RandomNumberGenerator.GetInt32(set.Length)];
}
