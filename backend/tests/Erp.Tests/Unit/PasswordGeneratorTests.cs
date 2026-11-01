using Erp.Infrastructure.Security;

namespace Erp.Tests.Unit;

public sealed class PasswordGeneratorTests
{
    [Fact]
    public void Generates_the_requested_length_with_every_character_class()
    {
        for (var i = 0; i < 200; i++)
        {
            var password = PasswordGenerator.Generate(14);

            Assert.Equal(14, password.Length);
            Assert.Contains(password, char.IsUpper);
            Assert.Contains(password, char.IsLower);
            Assert.Contains(password, char.IsDigit);
            Assert.Contains(password, c => "@#$%&*!?".Contains(c));
            Assert.DoesNotContain(password, c => "0O1lI".Contains(c));
        }
    }

    [Fact]
    public void Does_not_repeat()
    {
        var passwords = Enumerable.Range(0, 500).Select(_ => PasswordGenerator.Generate()).ToHashSet();

        Assert.Equal(500, passwords.Count);
    }

    [Fact]
    public void Rejects_short_lengths()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => PasswordGenerator.Generate(6));
    }
}
