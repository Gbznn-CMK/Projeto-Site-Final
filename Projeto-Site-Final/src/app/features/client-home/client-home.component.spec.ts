import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ClientHome } from './client-home.component';

describe('ClientHome', () => {
  let component: ClientHome;
  let fixture: ComponentFixture<ClientHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientHome],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
