import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BuscarComponent } from './buscar';

describe('BuscarComponent', () => {
  let component: BuscarComponent;
  let fixture: ComponentFixture<BuscarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
