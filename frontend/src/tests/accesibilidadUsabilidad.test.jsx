// Pruebas automatizadas E-25 a E-33: Teclado, ARIA, tabla responsiva, tema/fuente, panel, roles y Escape
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import Ingresar from '../pages/Ingresar';
import Panel from '../pages/Panel';
import ListadoReservas from '../pages/ListadoReservas';
import Ambientes from '../pages/Ambientes';
import ControlTamanoFuente from '../components/navegacion/ControlTamanoFuente';
import ConmutadorTema from '../components/navegacion/ConmutadorTema';
import { obtenerGruposPorRol } from '../constants/navegacion';
import { dbMock, reiniciarBaseMock, guardarIdSesionMock } from '../mocks/baseDatosMock';

beforeEach(() => {
  reiniciarBaseMock();
  sessionStorage.clear();
  localStorage.clear();
});

describe('Accesibilidad WCAG 2.2 AA, diseño adaptativo y usabilidad (E-25..33)', () => {
  it('E-25: recorrido por teclado enfoca correo al montar Ingresar y h1 al montar páginas', async () => {
    const { unmount } = render(<MemoryRouter><AuthProvider><Ingresar /></AuthProvider></MemoryRouter>);
    expect(document.activeElement).toBe(screen.getByLabelText(/correo institucional/i));
    unmount();
    guardarIdSesionMock('usr-admin');
    render(<MemoryRouter><AuthProvider><Panel /></AuthProvider></MemoryRouter>);
    expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1, name: 'Panel' }));
  });

  it('E-26: atributos ARIA (aria-invalid, aria-describedby, alert/status y aria-label dinámico)', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><AuthProvider><Ingresar /></AuthProvider></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /mostrar contraseña/i }));
    expect(screen.getByRole('button', { name: /ocultar contraseña/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    const inputCorreo = screen.getByLabelText(/correo institucional/i);
    expect(inputCorreo).toHaveAttribute('aria-invalid', 'true');
    expect(inputCorreo.getAttribute('aria-describedby')).toContain('-error');
  });

  it('E-27 y E-28: estructura responsive conserva un solo marcado semántico table con data-label', async () => {
    guardarIdSesionMock('usr-admin');
    render(<MemoryRouter><AuthProvider><ListadoReservas /></AuthProvider></MemoryRouter>);
    const tabla = await screen.findByRole('table');
    expect(tabla).toHaveClass('tabla-responsiva');
    expect(tabla.querySelectorAll('tbody td[data-label]').length).toBeGreaterThan(0);
  });

  it('E-29: tema oscuro aplica atributo data-tema y control de fuente persiste la escala', async () => {
    const user = userEvent.setup();
    render(<div><ControlTamanoFuente /><ConmutadorTema /></div>);
    await user.click(screen.getByRole('button', { name: /cambiar a modo oscuro/i }));
    expect(document.documentElement.getAttribute('data-tema')).toBe('oscuro');
    await user.click(screen.getByRole('button', { name: /tamaño de fuente grande/i }));
    expect(document.documentElement.style.fontSize).toBe('125%');
    expect(localStorage.getItem('reservaupla_tamano_fuente')).toBe('125%');
  });

  it('E-30: panel muestra indicadores con datos y estado vacío cuando hay cero reservas', async () => {
    guardarIdSesionMock('usr-admin');
    const { unmount } = render(<MemoryRouter><AuthProvider><Panel /></AuthProvider></MemoryRouter>);
    expect(await screen.findByRole('link', { name: /Reservas pendientes: 2/i })).toBeInTheDocument();
    unmount();
    dbMock.reservas = [];
    render(<MemoryRouter><AuthProvider><Panel /></AuthProvider></MemoryRouter>);
    expect(await screen.findByText(/no hay reservas registradas todavía/i)).toBeInTheDocument();
  });

  it('E-31 y E-32: navegación por rol y Responsable solo ve sus ambientes asignados', async () => {
    const gruposResp = obtenerGruposPorRol('Responsable');
    expect(gruposResp.flatMap((g) => g.items).some((i) => i.id === 'nueva-reserva')).toBe(false);
    guardarIdSesionMock('usr-resp');
    render(<MemoryRouter><AuthProvider><Ambientes /></AuthProvider></MemoryRouter>);
    expect(await screen.findByText('Laboratorio de Cómputo 101')).toBeInTheDocument();
    expect(screen.queryByText('Sala de Reuniones Decanato')).not.toBeInTheDocument();
  });

  it('E-33: Escape cierra el modal y devuelve el foco al botón disparador', async () => {
    guardarIdSesionMock('usr-admin');
    const user = userEvent.setup();
    render(<MemoryRouter><AuthProvider><Ambientes /></AuthProvider></MemoryRouter>);
    const botonAbrir = await screen.findByRole('button', { name: /nuevo ambiente/i });
    botonAbrir.focus();
    await user.click(botonAbrir);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(botonAbrir);
  });
});
