import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SacComponent } from './sac.component';

describe('SacComponent', () => {
  let fixture: ComponentFixture<SacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SacComponent] }).compileComponents();
    fixture = TestBed.createComponent(SacComponent);
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
