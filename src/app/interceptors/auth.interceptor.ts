
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
    // Recuperar el token de la sesión actual.
    const token = sessionStorage.getItem(
      'hotel_access_token'
    );

    if (!token) {
      return next.handle(req);
    }

    // SEGURIDAD [JWT-FRONT-04]:
    // Identificar exclusivamente nuestra API.
    const apiUrl = new URL(
      environment.API_URI,
      window.location.origin
    );

    const requestUrl = new URL(
      req.url,
      window.location.origin
    );

    const apiPath = apiUrl.pathname.replace(/\/+$/, '') + '/';

    // No enviar el JWT a servidores externos
    // ni a los servicios independientes de correo e imágenes.
    if (
      requestUrl.origin !== apiUrl.origin ||
      !requestUrl.pathname.startsWith(apiPath)
    ) {
      return next.handle(req);
    }

    // SEGURIDAD [JWT-FRONT-05]:
    // Evitar enviar el JWT mediante HTTP sin cifrar
    // a servidores remotos.
    const esLocal = ['localhost', '127.0.0.1'].includes(
      apiUrl.hostname
    );

    if (apiUrl.protocol !== 'https:' && !esLocal) {
      return next.handle(req);
    }

    // SEGURIDAD [JWT-FRONT-06]:
    // Mantener públicas las operaciones de acceso y registro.
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
      publica => ruta === publica ||
        ruta.startsWith(publica + '/')
    )) {
      return next.handle(req);
    }

    // No sobrescribir un encabezado definido explícitamente.
    if (req.headers.has('Authorization')) {
      return next.handle(req);
    }

    // SEGURIDAD [JWT-FRONT-03]:
    // Agregar automáticamente el JWT.
    const peticionAutenticada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(peticionAutenticada);
  }
}
