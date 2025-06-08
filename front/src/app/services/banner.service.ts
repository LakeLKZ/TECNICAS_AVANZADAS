import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Banner, BannerCreateResponse } from '../models/banner.model';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private apiUrl = 'http://localhost:8080/api/banners';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los banners
   */
  getBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene un banner por ID
   */
  getBanner(id: number): Observable<Banner> {
    return this.http.get<Banner>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Crea un nuevo banner
   */
  createBanner(banner: Banner): Observable<BannerCreateResponse> {
    return this.http.post<BannerCreateResponse>(this.apiUrl, banner)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Maneja errores HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }

    console.error('Error en BannerService:', errorMessage);
    return throwError(() => errorMessage);
  }

  /**
   * Valida si una posición puede aceptar más banners
   */
  canAddBannerToPosition(banners: Banner[], position: string): boolean {
    const bannersInPosition = banners.filter(b => b.position === position);

    switch (position) {
      case 'FLOATING_MAIN':
      case 'HEADER':
        return bannersInPosition.length < 1;
      case 'RIGHT_SIDE':
        return bannersInPosition.length < 3;
      case 'FOOTER':
        return bannersInPosition.length < 2;
      default:
        return false;
    }
  }

  /**
   * Obtiene el siguiente número de orden disponible para una posición
   */
  getNextDisplayOrder(banners: Banner[], position: string): number {
    const bannersInPosition = banners.filter(b => b.position === position);
    if (bannersInPosition.length === 0) {
      return 1;
    }

    const maxOrder = Math.max(...bannersInPosition.map(b => b.displayOrder));
    return maxOrder + 1;
  }
}
