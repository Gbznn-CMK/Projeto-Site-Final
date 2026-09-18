import { routes } from './app.routes';

describe('application routes', () => {
  it('registers the public and protected application flows', () => {
    const paths = routes.map((route) => route.path);
    expect(paths).toEqual(expect.arrayContaining([
      'login',
      'cadastro',
      'home-cliente',
      'home-prestador',
      'agendamentos',
      'agendamentos/novo',
      'favoritos',
    ]));
  });

  it('protects authenticated pages', () => {
    expect(routes.find((route) => route.path === 'home-cliente')?.canActivate).toBeTruthy();
    expect(routes.find((route) => route.path === 'agendamentos')?.canActivate).toBeTruthy();
    expect(routes.find((route) => route.path === 'login')?.canActivate).toBeFalsy();
  });
});
