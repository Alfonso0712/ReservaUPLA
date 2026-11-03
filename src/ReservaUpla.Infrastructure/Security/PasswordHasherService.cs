using Microsoft.AspNetCore.Identity;
using ReservaUpla.Application.Interfaces;

namespace ReservaUpla.Infrastructure.Security;

// E-08
public class PasswordHasherService : IPasswordHasherService
{
    private readonly PasswordHasher<object> _hasher = new();
    private readonly string _dummyHash;

    public PasswordHasherService()
    {
        _dummyHash = _hasher.HashPassword(new object(), "DummyPassword123*");
    }

    public string HashPassword(string contrasena)
    {
        return _hasher.HashPassword(new object(), contrasena);
    }

    public bool VerifyPassword(string hash, string contrasenaProporcionada)
    {
        var result = _hasher.VerifyHashedPassword(new object(), hash, contrasenaProporcionada);
        return result == PasswordVerificationResult.Success || result == PasswordVerificationResult.SuccessRehashNeeded;
    }

    public void VerifyDummyPassword()
    {
        _hasher.VerifyHashedPassword(new object(), _dummyHash, "DummyPasswordPrueba");
    }
}
