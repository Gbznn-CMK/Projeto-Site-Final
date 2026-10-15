import { routes } from './app.routes';

describe('application routes', () => {
  it('registers the public and protected application flows', () => {
    const paths = routes.flatMap((route) => [
      route.path,
      ...(route.children?.map((child) => child.path) ?? []),
    ]);
    expect(paths).toEqual(
      expect.arrayContaining([
        'login',
        'cadastro',
        'home-cliente',
        'home-prestador',
        'agendamentos',
        'agendamentos/novo',
        'favoritos',
      ]),
    );
  });

  it('protects authenticated pages', () => {
    const clientLayout = routes.find((route) => route.children?.some((child) => child.path === 'home-cliente'));
    const bookingLayout = routes.find((route) => route.children?.some((child) => child.path === 'agendamentos'));
    expect(clientLayout?.canActivate).toBeTruthy();
    expect(bookingLayout?.canActivate).toBeTruthy();
    expect(routes.find((route) => route.path === 'login')?.canActivate).toBeFalsy();
  });
});
