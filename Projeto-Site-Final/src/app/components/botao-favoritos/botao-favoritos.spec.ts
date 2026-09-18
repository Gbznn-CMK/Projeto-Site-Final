import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BotaoFavoritoComponent } from './botao-favoritos';

describe('BotaoFavoritoComponent', () => {
  let component: BotaoFavoritoComponent;
  let fixture: ComponentFixture<BotaoFavoritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotaoFavoritoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BotaoFavoritoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
