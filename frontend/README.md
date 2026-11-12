# NaHora

Aplicação web para encontrar prestadores de serviços, consultar serviços disponíveis e realizar agendamentos. O projeto também possui um fluxo separado para prestadores gerenciarem agenda, disponibilidade e serviços.

> **Estado atual:** protótipo funcional. A aplicação usa dados mockados e `localStorage`; não existe backend ou autenticação real neste repositório.

## Para começar rapidamente

### Pré-requisitos

- Node.js compatível com Angular 22.
- npm 11 (versão definida em `package.json`).

### Instalação e execução

Na raiz do repositório:

```bash
npm install
npm start
```

Abra `http://localhost:4200/`. O servidor de desenvolvimento recarrega a aplicação automaticamente após alterações.

Comandos disponíveis:

| Comando | Uso |
| --- | --- |
| `npm start` | Inicia o servidor local em modo de desenvolvimento |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run watch` | Gera o build continuamente em modo de desenvolvimento |
| `npm test` | Executa os testes unitários com Vitest |

O projeto também pode ser executado usando diretamente o Angular CLI, por exemplo `npx ng serve`.

## Fluxo principal do produto

### Cliente

1. Acessa a página inicial e pesquisa prestadores por categoria ou texto.
2. Consulta o perfil do prestador e seus serviços.
3. Escolhe um serviço, data, horário e método de pagamento.
4. Acompanha, confirma ou cancela agendamentos.
5. Gerencia favoritos, perfil, configurações e chamados de suporte.

### Prestador

1. Acessa a área de prestador.
2. Cadastra e edita serviços.
3. Define horários de disponibilidade e bloqueios.
4. Consulta a agenda e atualiza o andamento dos agendamentos.
5. Gerencia o perfil do estabelecimento e acessa suporte/configurações.

## Contas de demonstração

Todas as contas mockadas usam a senha `12345678`.

| Perfil | E-mail |
| --- | --- |
| Cliente | `ana@example.com` |
| Cliente | `carlos@example.com` |
| Prestador | `joao@barbearia.com` |
| Prestador | `maria@salon.com` |
| Prestador | `fernanda@nails.com` |
| Prestador | `roberto@tecnico.com` |
| Prestador | `sofia@estetica.com` |
| Prestador | `lucas@foto.com` |

As contas e os demais dados iniciais são definidos em [`src/app/core/data/`](./Projeto-Site-Final/src/app/core/data/). Não use essas credenciais ou a implementação de token em produção.

## Arquitetura do código

O código da aplicação está em [`Projeto-Site-Final/src/`](./Projeto-Site-Final/src/).

```text
src/
├── app/
│   ├── core/
│   │   ├── data/       # Dados mockados e inicialização do localStorage
│   │   ├── guards/     # Regras de acesso por autenticação e perfil
│   │   ├── models/     # Interfaces, tipos e constantes de domínio
│   │   ├── services/   # Autenticação, usuários, agenda, serviços e suporte
│   │   └── utils/      # Utilitários compartilhados, incluindo storage
│   ├── features/       # Telas e fluxos específicos de cliente/prestador
│   ├── layouts/        # Estruturas de navegação de cliente e prestador
│   ├── components/     # Componentes de aplicação, como favoritos
│   └── shared/         # Componentes, pipes, páginas e utilitários reutilizáveis
├── main.ts             # Entrada do browser
├── main.server.ts      # Entrada SSR
└── server.ts           # Servidor Angular SSR
```

### Onde fazer cada alteração

- **Regra de domínio ou contrato de dados:** comece por [`src/app/core/models/types.ts`](./Projeto-Site-Final/src/app/core/models/types.ts).
- **Dados de demonstração:** altere os arquivos em [`src/app/core/data/`](./Projeto-Site-Final/src/app/core/data/); `mock-data.ts` centraliza a exportação e inicialização.
- **Persistência e comportamento de negócio:** reutilize ou altere os serviços em [`src/app/core/services/`](./Projeto-Site-Final/src/app/core/services/).
- **Nova tela ou fluxo:** crie a feature em [`src/app/features/`](./Projeto-Site-Final/src/app/features/) e registre a rota em [`src/app/app.routes.ts`](./Projeto-Site-Final/src/app/app.routes.ts).
- **Elementos usados por várias telas:** prefira [`src/app/shared/`](./Projeto-Site-Final/src/app/shared/) ou [`src/app/components/`](./Projeto-Site-Final/src/app/components/).
- **Estilos globais:** [`src/styles.css`](./Projeto-Site-Final/src/styles.css) e [`src/app/shared/styles/global.css`](./Projeto-Site-Final/src/app/shared/styles/global.css).
- **Imagens e arquivos públicos:** [`public/`](./public/).

## Rotas relevantes

As rotas são definidas em [`src/app/app.routes.ts`](./Projeto-Site-Final/src/app/app.routes.ts).

| Área | Rotas |
| --- | --- |
| Pública | `/login`, `/cadastro` |
| Cliente | `/home-cliente`, `/buscar`, `/agendamentos`, `/favoritos`, `/perfil` |
| Novo agendamento | `/agendamentos/novo/:prestadorId` |
| Prestador | `/home-prestador`, `/agenda-prestador`, `/servicos-prestador`, `/disponibilidade-prestador` |
| Compartilhada autenticada | `/suporte`, `/configuracoes` |

O acesso às áreas de cliente e prestador depende do `authGuard` e do perfil retornado pelo `AuthService`. Há aliases de rotas antigas para preservar links existentes.

## Dados e autenticação no protótipo

- Na primeira inicialização, [`initializeMockData`](./Projeto-Site-Final/src/app/core/data/mock-data.ts) grava os mocks no `localStorage`.
- As chaves usam o prefixo `nahora_`, por exemplo `nahora_usuarios`, `nahora_prestadores` e `nahora_agendamentos`.
- O login é simulado pelo [`AuthService`](./Projeto-Site-Final/src/app/core/services/auth.service.ts).
- O token é um JWT falso, usado apenas para manter o identificador do usuário entre recarregamentos.
- Alterações feitas pela interface ficam no navegador atual e não são compartilhadas com outros usuários.
- Para restaurar os dados iniciais, remova as chaves `nahora_*` do armazenamento local do navegador e recarregue a aplicação.

Durante SSR, o acesso ao armazenamento deve passar por [`getLocalStorage`](./Projeto-Site-Final/src/app/core/utils/storage.ts), pois `localStorage` não existe no ambiente do servidor.

## Convenções para desenvolvimento

1. Preserve os tipos de domínio existentes; evite `any` e casts sem necessidade.
2. Coloque regras de negócio nos serviços, não diretamente nos templates.
3. Use os componentes e utilitários compartilhados antes de criar duplicações.
4. Ao adicionar ou alterar uma feature, atualize a rota, o guard (quando aplicável) e os testes relacionados.
5. Mantenha textos e rotas compatíveis com o idioma atual da aplicação (português).
6. Não trate dados mockados como uma camada de segurança ou como uma API real.
7. Antes de abrir uma alteração, execute `npm test` e `npm run build`.

## Orientações para agentes de IA

Antes de editar:

1. Leia este README, a rota envolvida e o serviço/modelo usado pelo fluxo.
2. Verifique o estado do Git para não sobrescrever alterações de outra pessoa.
3. Procure implementações semelhantes em `features`, `core/services` e `shared`.

Ao editar:

- Faça mudanças pequenas e coerentes com a arquitetura atual.
- Reutilize interfaces de `core/models/types.ts` e o padrão de componentes standalone.
- Considere os dois perfis (`cliente` e `prestador`) quando uma mudança afetar autenticação, navegação ou agendamentos.
- Preserve o comportamento de SSR e o uso seguro de `getLocalStorage`.
- Adicione ou atualize o teste `.spec.ts` da unidade alterada.
- Não introduza backend, bibliotecas ou mudanças de dependências sem necessidade explícita.

Ao finalizar:

- Execute os testes e o build.
- Informe arquivos alterados, comportamento implementado e comandos executados.
- Se uma validação não puder ser executada, registre claramente o motivo.

## Licença e estado do projeto

Este repositório é um projeto de desenvolvimento acadêmico/prototipal. Consulte os responsáveis pelo projeto antes de reutilizar código, imagens ou dados fora deste contexto.
