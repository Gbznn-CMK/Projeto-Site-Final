import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProviderHome } from './provider-home.component';

describe('ProviderHome', () => {
  let component: ProviderHome;
  let fixture: ComponentFixture<ProviderHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderHome],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
