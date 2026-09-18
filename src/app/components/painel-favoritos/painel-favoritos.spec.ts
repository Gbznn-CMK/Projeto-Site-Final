import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PainelFavoritosComponent } from './painel-favoritos';


describe('PainelFavoritosComponent', () => {
  let component: PainelFavoritosComponent;
  let fixture: ComponentFixture<PainelFavoritosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelFavoritosComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PainelFavoritosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
