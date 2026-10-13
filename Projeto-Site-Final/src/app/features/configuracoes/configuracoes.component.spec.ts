import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiguracoesComponent } from './configuracoes.component';

describe('ConfiguracoesComponent', () => {
  let fixture: ComponentFixture<ConfiguracoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ConfiguracoesComponent] }).compileComponents();
    fixture = TestBed.createComponent(ConfiguracoesComponent);
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
