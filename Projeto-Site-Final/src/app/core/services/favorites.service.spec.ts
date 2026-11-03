import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
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
