// Pruebas automatizadas E-01 a E-06: Registro de solicitantes y normalización
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegistroSolicitante from '../pages/RegistroSolicitante';
import { reiniciarBaseMock } from '../mocks/baseDatosMock';
import { validarNombreCompleto, validarMotivoReserva } from '../validation/validadores';
import { MENSAJES } from '../constants/mensajes';
import * as usuarioService from '../services/usuarioService';

beforeEach(() => {
  reiniciarBaseMock();
  sessionStorage.clear();
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Registro de solicitante (RF-01 · RV-01..03)', () => {
  it('E-01: registro correcto muestra confirmación con h1 enfocado', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegistroSolicitante /></MemoryRouter>);
    await user.type(screen.getByLabelText(/nombre completo/i), 'Ana María Torres');
    await user.type(screen.getByLabelText(/correo institucional/i), 'atorres@upla.edu.pe');
    await user.type(screen.getByLabelText(/^contraseña/i), 'ClaveSegura2026');
    await user.click(screen.getByRole('button', { name: /crear cuenta de solicitante/i }));
    const tituloExito = await screen.findByRole('heading', { level: 1, name: MENSAJES.REGISTRO_EXITOSO_TITULO });
    expect(tituloExito).toBeInTheDocument();
    expect(document.activeElement).toBe(tituloExito);
  });

  it('E-02: campos vacíos muestran errores y enfocan el primer campo inválido', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegistroSolicitante /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /crear cuenta de solicitante/i }));
    expect(await screen.findByText(MENSAJES.NOMBRE_OBLIGATORIO)).toBeInTheDocument();
    expect(screen.getByText(MENSAJES.CORREO_OBLIGATORIO)).toBeInTheDocument();
    expect(screen.getByText(MENSAJES.CONTRASENA_OBLIGATORIA)).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByLabelText(/nombre completo/i));
  });

  it('E-03: correo con formato incorrecto rechaza dominios externos', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegistroSolicitante /></MemoryRouter>);
    await user.type(screen.getByLabelText(/nombre completo/i), 'Pedro Rojas');
    await user.type(screen.getByLabelText(/correo institucional/i), 'pedro@gmail.com');
    await user.type(screen.getByLabelText(/^contraseña/i), 'ClaveSegura2026');
    await user.click(screen.getByRole('button', { name: /crear cuenta de solicitante/i }));
    expect(await screen.findByText(MENSAJES.CORREO_FORMATO_INVALIDO)).toBeInTheDocument();
  });

  it('E-04: correo duplicado (409 simulado) muestra error en el campo correo', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><RegistroSolicitante /></MemoryRouter>);
    await user.type(screen.getByLabelText(/nombre completo/i), 'Carlos Mendoza');
    await user.type(screen.getByLabelText(/correo institucional/i), 'admin@upla.edu.pe');
    await user.type(screen.getByLabelText(/^contraseña/i), 'ClaveSegura2026');
    await user.click(screen.getByRole('button', { name: /crear cuenta de solicitante/i }));
    expect(await screen.findByText(MENSAJES.CORREO_DUPLICADO)).toBeInTheDocument();
  });

  it('E-05: límites de longitud (mín-1, mín, máx, máx+1) validan bordes exactos', () => {
    expect(validarNombreCompleto('Ab')).toBe(MENSAJES.NOMBRE_LONGITUD_INVALIDA);
    expect(validarNombreCompleto('Ana')).toBe('');
    expect(validarNombreCompleto('A'.repeat(150))).toBe('');
    expect(validarNombreCompleto('A'.repeat(151))).toBe(MENSAJES.NOMBRE_LONGITUD_INVALIDA);
    expect(validarMotivoReserva('A'.repeat(9))).toBe(MENSAJES.RESERVA_MOTIVO_LONGITUD);
    expect(validarMotivoReserva('A'.repeat(10))).toBe('');
    expect(validarMotivoReserva('A'.repeat(500))).toBe('');
    expect(validarMotivoReserva('A'.repeat(501))).toBe(MENSAJES.RESERVA_MOTIVO_LONGITUD);
  });

  it('E-06: espacios y mayúsculas normalizados antes de enviar al servicio', async () => {
    const espia = vi.spyOn(usuarioService, 'registrarSolicitanteApi');
    const user = userEvent.setup();
    render(<MemoryRouter><RegistroSolicitante /></MemoryRouter>);
    await user.type(screen.getByLabelText(/nombre completo/i), '  Juan   Pérez   Soto  ');
    await user.type(screen.getByLabelText(/correo institucional/i), '  JPEREZ@UPLA.EDU.PE  ');
    await user.type(screen.getByLabelText(/^contraseña/i), 'ClaveSegura2026');
    await user.click(screen.getByRole('button', { name: /crear cuenta de solicitante/i }));
    expect(espia).toHaveBeenCalledWith(expect.objectContaining({ nombreCompleto: 'Juan Pérez Soto', correo: 'jperez@upla.edu.pe' }));
  });
});
