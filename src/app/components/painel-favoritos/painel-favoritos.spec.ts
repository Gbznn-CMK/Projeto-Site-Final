import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PainelFavoritos } from './painel-favoritos';

describe('PainelFavoritos', () => {
  let component: PainelFavoritos;
  let fixture: ComponentFixture<PainelFavoritos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelFavoritos],
    }).compileComponents();

    fixture = TestBed.createComponent(PainelFavoritos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
