namespace ReservaUpla.Application.Interfaces;

// E-08
public interface IPasswordHasherService
{
    string HashPassword(string contrasena);
    bool VerifyPassword(string hash, string contrasenaProporcionada);
    void VerifyDummyPassword();
}
