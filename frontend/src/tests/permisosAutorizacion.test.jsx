// Pruebas E-45, E-46 y E-47: Matriz de permisos, código limpio sin comparación de roles y accionesPermitidas
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PERMISOS } from '../constants/permisos';
import { obtenerItemsPorPermiso } from '../constants/navegacion';
import { obtenerPermisosDeRol } from '../mocks/permisosPorRol';
import { accionesPermitidas } from '../utils/accionesPermitidas';

describe('Permisos y Autorización (E-45..E-47)', () => {
  it('E-45: menú de navegación se deriva estrictamente de la función puede(...)', () => {
    const puedeAdmin = (p) => obtenerPermisosDeRol('Administrador').includes(p);
    const puedeResp = (p) => obtenerPermisosDeRol('Responsable').includes(p);
    const puedeSolic = (p) => obtenerPermisosDeRol('Solicitante').includes(p);

    expect(obtenerItemsPorPermiso(puedeAdmin).map((i) => i.id)).toEqual(['panel', 'reservas', 'ambientes']);
    expect(obtenerItemsPorPermiso(puedeResp).map((i) => i.id)).toEqual(['panel', 'reservas', 'ambientes']);
    expect(obtenerItemsPorPermiso(puedeSolic).map((i) => i.id)).toEqual(['panel', 'reservas', 'ambientes']);

    const puedeSoloPanel = (p) => p === PERMISOS.DASHBOARD_VER;
    expect(obtenerItemsPorPermiso(puedeSoloPanel).map((i) => i.id)).toEqual(['panel']);
  });

  it('E-46: ningún archivo en frontend/src fuera de mocks y tests compara roles', () => {
    const dirActual = path.dirname(fileURLToPath(import.meta.url));
    const raizSrc = path.resolve(dirActual, '..');
    const listarArchivos = (dir) => {
      let resultados = [];
      for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
          if (ent.name !== 'mocks' && ent.name !== 'tests') resultados = resultados.concat(listarArchivos(full));
        } else if (/\.(js|jsx)$/.test(ent.name)) {
          resultados.push(full);
        }
      }
      return resultados;
    };

    const archivos = listarArchivos(raizSrc);
    const regexRol = /(\.rol\s*[!=]==?|\brol\s*[!=]==?)/;
    const ofensas = [];

    for (const archivo of archivos) {
      const contenido = fs.readFileSync(archivo, 'utf-8');
      if (regexRol.test(contenido)) ofensas.push(path.relative(raizSrc, archivo));
    }

    expect(ofensas).toEqual([]);
  });

  it('E-47: accionesPermitidas valida exactamente la matriz de estados y permisos', () => {
    const uAdmin = { id: 'usr-admin' };
    const uSolic1 = { id: 'usr-1' };
    const pAdmin = (p) => obtenerPermisosDeRol('Administrador').includes(p);
    const pSolic = (p) => obtenerPermisosDeRol('Solicitante').includes(p);
    const pResp = (p) => obtenerPermisosDeRol('Responsable').includes(p);

    const rPropiaPend = { id: 'r1', estado: 'Pendiente', solicitante: { id: 'usr-1' } };
    const rPropiaAprob = { id: 'r2', estado: 'Aprobada', solicitante: { id: 'usr-1' } };
    const rAjenaPend = { id: 'r3', estado: 'Pendiente', solicitante: { id: 'usr-2' } };
    const rRech = { id: 'r4', estado: 'Rechazada', solicitante: { id: 'usr-1' } };

    expect(accionesPermitidas(rPropiaPend, uAdmin, pAdmin)).toEqual(['aprobar', 'rechazar', 'cancelar']);
    expect(accionesPermitidas(rPropiaAprob, uAdmin, pAdmin)).toEqual(['cancelar']);
    expect(accionesPermitidas(rRech, uAdmin, pAdmin)).toEqual([]);

    expect(accionesPermitidas(rPropiaPend, uSolic1, pSolic)).toEqual(['cancelar']);
    expect(accionesPermitidas(rPropiaAprob, uSolic1, pSolic)).toEqual(['cancelar']);
    expect(accionesPermitidas(rAjenaPend, uSolic1, pSolic)).toEqual([]);
    expect(accionesPermitidas(rRech, uSolic1, pSolic)).toEqual([]);

    expect(accionesPermitidas(rPropiaPend, { id: 'usr-resp' }, pResp)).toEqual([]);
  });
});
