import { TestBed } from '@angular/core/testing';
import { FavoritosService } from './favoritos';

describe('FavoritosService', () => {
  let service: FavoritosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('persists favorite ids and exposes their details', () => {
    service.favoritar(1).subscribe();
    expect(service.listarIds()).toBeTruthy();
    service.listarIds().subscribe((ids) => expect(ids).toEqual([1]));
    service.listarDetalhes().subscribe((lojas) => expect(lojas[0].nome).toBe('Barbearia Central'));
    service.desfavoritar(1).subscribe();
    service.listarIds().subscribe((ids) => expect(ids).toEqual([]));
  });
});
