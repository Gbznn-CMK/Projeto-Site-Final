import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private apiUrl = '/api/favoritos';

  constructor(private http: HttpClient) {}

  listarIds() {
    return this.http.get<number[]>(this.apiUrl);
  }

  listarDetalhes() {
    return this.http.get<any[]>(`${this.apiUrl}/detalhes`);
  }

  favoritar(lojaId: number) {
    return this.http.post(`${this.apiUrl}/${lojaId}`, {});
  }

  desfavoritar(lojaId: number) {
    return this.http.delete(`${this.apiUrl}/${lojaId}`);
  }
}