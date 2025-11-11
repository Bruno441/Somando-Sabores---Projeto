# 🔐 Sistema de Autenticação - Admin Panel

## 📋 Visão Geral

Sistema de autenticação implementado para proteger as páginas administrativas do painel de controle.

## 🔑 Credenciais de Acesso (MVP)

Para este MVP, as credenciais estão hardcoded no sistema:

- **Usuário:** `admin`
- **Senha:** `admin123`

> ⚠️ **Importante:** Em produção, essas credenciais devem ser substituídas por uma integração real com o backend usando JWT.

## 🏗️ Arquitetura

### 1. **AuthService** (`src/app/services/auth/auth.service.ts`)
Serviço responsável por gerenciar a autenticação do usuário.

**Principais métodos:**
- `login(username, password)` - Valida credenciais e cria sessão
- `logout()` - Encerra sessão e redireciona para login
- `isAuthenticated()` - Verifica se usuário está autenticado
- `getToken()` - Retorna o token de autenticação

**Armazenamento:**
- Token salvo no `localStorage` com a chave `auth_token`
- Token é um Base64 do username + timestamp (temporário para MVP)

### 2. **AuthGuard** (`src/app/guards/auth.guard.ts`)
Guard que protege as rotas administrativas.

**Funcionamento:**
- Verifica se o usuário está autenticado antes de permitir acesso
- Redireciona para `/admin-panel` se não autenticado
- Preserva a URL original para retornar após login bem-sucedido

### 3. **AdminPanelComponent** (Página de Login)
Componente com formulário de login.

**Recursos:**
- Validação de campos obrigatórios
- Mensagens de erro amigáveis
- Desabilita botão se campos vazios
- Redireciona automaticamente se já autenticado
- Retorna para página original após login

### 4. **SideBarComponent**
Barra lateral com botão de logout.

**Recursos:**
- Botão de logout no rodapé
- Confirmação antes de sair
- Redirecionamento automático para login

## 🛣️ Rotas Protegidas

As seguintes rotas estão protegidas pelo `AuthGuard`:

```typescript
- /admin-panel/relatorios
- /admin-panel/reservas
- /admin-panel/pacotes
- /admin-panel/pagamentos
```

## 🎨 Interface

### Página de Login
- Campo de usuário
- Campo de senha (type="password")
- Botão "Entrar" (desabilitado se campos vazios)
- Mensagem de erro exibida quando credenciais inválidas
- Design responsivo

### Botão de Logout
- Localizado no rodapé da sidebar
- Ícone + texto "Sair"
- Confirmação antes de executar logout
- Efeitos hover

## 🔄 Fluxo de Autenticação

### Login:
1. Usuário acessa `/admin-panel`
2. Preenche credenciais
3. Sistema valida (username === 'admin' && password === 'admin123')
4. Se válido: salva token no localStorage e redireciona
5. Se inválido: exibe mensagem de erro

### Acesso a Páginas Protegidas:
1. Usuário tenta acessar rota protegida
2. AuthGuard verifica se está autenticado
3. Se sim: permite acesso
4. Se não: redireciona para `/admin-panel` com returnUrl

### Logout:
1. Usuário clica em "Sair"
2. Sistema pede confirmação
3. Remove token do localStorage
4. Redireciona para `/admin-panel`

## 🚀 Como Usar

### Para Desenvolvedores:

#### Proteger uma nova rota:
```typescript
import { AuthGuard } from './guards/auth.guard';

{
  path: 'nova-rota-admin',
  component: NovoComponente,
  canActivate: [AuthGuard]
}
```

#### Verificar autenticação em componente:
```typescript
import { AuthService } from './services/auth/auth.service';

constructor(private authService: AuthService) {}

ngOnInit() {
  if (this.authService.isAuthenticated()) {
    // Usuário está logado
  }
}
```

#### Fazer logout programaticamente:
```typescript
this.authService.logout();
```

## 🔮 Próximos Passos (Produção)

### 1. Integração com Backend
- [ ] Criar endpoint `/api/auth/login` no backend ASP.NET
- [ ] Implementar JWT (JSON Web Token)
- [ ] Validar credenciais no banco de dados
- [ ] Retornar token JWT válido

### 2. Melhorias no AuthService
```typescript
login(username: string, password: string): Observable<boolean> {
  return this.http.post<{token: string}>('/api/auth/login', {
    username, 
    password
  }).pipe(
    map(response => {
      localStorage.setItem('auth_token', response.token);
      this.isAuthenticatedSubject.next(true);
      return true;
    }),
    catchError(() => of(false))
  );
}
```

### 3. Interceptor HTTP
- [ ] Criar HttpInterceptor para adicionar token em todas requisições
- [ ] Implementar refresh token
- [ ] Tratar erros 401 (não autorizado)

### 4. Segurança Adicional
- [ ] Implementar expiração de token
- [ ] Adicionar rate limiting no login
- [ ] Implementar recuperação de senha
- [ ] Adicionar autenticação de dois fatores (2FA)
- [ ] Logs de tentativas de login

### 5. Melhorias de UX
- [ ] Loading spinner durante login
- [ ] Lembrar usuário (opção "Manter conectado")
- [ ] Timeout de sessão com aviso
- [ ] Múltiplos níveis de acesso (admin, moderador, etc)

## 🧪 Como Testar

### Teste de Login Bem-Sucedido:
1. Acesse `http://localhost:4200/admin-panel`
2. Digite: **admin** / **admin123**
3. Clique em "Entrar"
4. Deve redirecionar para `/admin-panel/reservas`

### Teste de Login Falhado:
1. Acesse `http://localhost:4200/admin-panel`
2. Digite credenciais incorretas
3. Deve exibir mensagem: "Usuário ou senha incorretos"

### Teste de Proteção de Rota:
1. **Sem estar logado**, tente acessar: `http://localhost:4200/admin-panel/reservas`
2. Deve redirecionar para `/admin-panel`
3. Faça login
4. Deve retornar automaticamente para `/admin-panel/reservas`

### Teste de Logout:
1. Faça login
2. Navegue para qualquer página admin
3. Clique no botão "Sair" na sidebar
4. Confirme
5. Deve redirecionar para `/admin-panel`
6. Tente acessar páginas protegidas novamente
7. Deve ser bloqueado

## 📝 Notas Técnicas

- Token armazenado em `localStorage` (considerar `sessionStorage` para maior segurança)
- Guard implementado como `CanActivate`
- Serviço usa `BehaviorSubject` para estado reativo
- Todas as rotas admin protegidas por guard
- Confirmação antes de logout para evitar saída acidental

## 🐛 Troubleshooting

### "Não consigo fazer login"
- Verifique se está usando as credenciais corretas: `admin` / `admin123`
- Verifique o console do navegador para erros
- Limpe o localStorage: `localStorage.clear()`

### "Ainda consigo acessar páginas admin sem login"
- Verifique se o AuthGuard está importado nas rotas
- Verifique se o `canActivate: [AuthGuard]` está presente na rota

### "Logout não funciona"
- Verifique se o AuthService está injetado corretamente
- Verifique o console para erros
- Limpe manualmente: `localStorage.removeItem('auth_token')`
