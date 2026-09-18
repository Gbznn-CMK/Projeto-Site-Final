import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomePrestador } from './home-prestador';

describe('HomePrestador', () => {
  let component: HomePrestador;
  let fixture: ComponentFixture<HomePrestador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePrestador],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePrestador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
