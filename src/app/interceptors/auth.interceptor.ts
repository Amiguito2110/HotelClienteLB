import { Injectable } from '@angular/core';

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // SEGURIDAD [JWT-FRONT-03]:
    // Recuperar el token de la sesión.
    const token = sessionStorage.getItem(
      'hotel_access_token'
    );

    if (!token) {
      return next.handle(req);
    }

    // Identificar los dos servidores de Hotel Campestre.
    const apiUrl = new URL(
      environment.API_URI,
      window.location.origin
    );

    const imagenesUrl = new URL(
      environment.API_URI_IMAGES,
      window.location.origin
    );

    const requestUrl = new URL(
      req.url,
      window.location.origin
    );

    const apiPath =
      apiUrl.pathname.replace(/\/+$/, '') + '/';

    const imagenesPath =
      imagenesUrl.pathname.replace(/\/+$/, '');

    const rutaSolicitada =
      requestUrl.pathname.replace(/\/+$/, '');

    // SEGURIDAD [JWT-FRONT-04]:
    // Verificar que sea nuestra API principal.
    const esApiPrincipal =
      requestUrl.origin === apiUrl.origin &&
      requestUrl.pathname.startsWith(apiPath);

    // SEGURIDAD [IMG-AUTH-01]:
    // Autorizar el envío del token exclusivamente
    // a los endpoints de gestión de imágenes.
    const esServidorImagenes =
      requestUrl.origin === imagenesUrl.origin &&
      req.method === 'POST' &&
      (
        rutaSolicitada ===
          `${imagenesPath}/uploadImagen` ||
        rutaSolicitada ===
          `${imagenesPath}/deleteImagen`
      );

    // No enviar JWT a servidores o rutas no autorizadas.
    if (!esApiPrincipal && !esServidorImagenes) {
      return next.handle(req);
    }

    // SEGURIDAD [JWT-FRONT-05]:
    // No transmitir JWT por HTTP hacia servidores remotos.
    const destino = esApiPrincipal
      ? apiUrl
      : imagenesUrl;

    const esLocal = [
      'localhost',
      '127.0.0.1'
    ].includes(destino.hostname);

    if (destino.protocol !== 'https:' && !esLocal) {
      return next.handle(req);
    }

    // SEGURIDAD [JWT-FRONT-06]:
    // Conservar públicas las operaciones
    // de autenticación y registro de cuentas.
    if (esApiPrincipal) {

      const ruta = requestUrl.pathname
        .slice(apiPath.length)
        .replace(/\/+$/, '');

      const rutasPublicas = [
        'cuenta/validar_cuenta',
        'cuenta/crear_cuenta',
        'cuenta/correo_existe',
        'cuenta/correo_existe2'
      ];

      if (rutasPublicas.some(
        publica =>
          ruta === publica ||
          ruta.startsWith(publica + '/')
      )) {
        return next.handle(req);
      }
    }

    // No sobrescribir un Authorization existente.
    if (req.headers.has('Authorization')) {
      return next.handle(req);
    }

    // SEGURIDAD [JWT-FRONT-07]:
    // Adjuntar JWT únicamente a destinos autorizados.
    const peticionAutenticada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(peticionAutenticada);
  }
}
