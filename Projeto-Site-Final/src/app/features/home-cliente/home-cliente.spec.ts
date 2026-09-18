import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomeCliente } from './home-cliente';

describe('HomeCliente', () => {
  let component: HomeCliente;
  let fixture: ComponentFixture<HomeCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCliente],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeCliente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
