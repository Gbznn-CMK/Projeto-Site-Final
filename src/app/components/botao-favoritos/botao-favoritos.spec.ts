import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BotaoFavoritos } from './botao-favoritos';

describe('BotaoFavoritos', () => {
  let component: BotaoFavoritos;
  let fixture: ComponentFixture<BotaoFavoritos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotaoFavoritos],
    }).compileComponents();

    fixture = TestBed.createComponent(BotaoFavoritos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
