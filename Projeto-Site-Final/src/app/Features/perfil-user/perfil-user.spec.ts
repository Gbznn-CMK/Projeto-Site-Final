import { ComponentFixture,TestBed } from '@angular/core/testing';
import { perfilUser } from './perfil-user';


describe('PerfilUser', () => {
  let component: perfilUser;
  let fixture: ComponentFixture<perfilUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [perfilUser],
    }).compileComponents();

    fixture = TestBed.createComponent(perfilUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
