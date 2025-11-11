# 🚀 Guia de Deploy no Render - Backend + Database

## 📋 Visão Geral

Este guia vai te ajudar a fazer o deploy do backend ASP.NET e PostgreSQL no Render.

## 🗄️ Parte 1: Deploy do PostgreSQL

### Passo 1: Criar o Banco de Dados no Render

1. Acesse: https://dashboard.render.com/
2. Clique em **"New +"** → **"PostgreSQL"**
3. Preencha os dados:
   - **Name**: `somando-sabores-db`
   - **Database**: `ssdb`
   - **User**: `restaurantuser` (ou deixe o padrão)
   - **Region**: `Oregon (US West)` ou mais próximo de você
   - **Plan**: Escolha **Free** para testes

4. Clique em **"Create Database"**

5. **Aguarde** a criação (pode levar alguns minutos)

### Passo 2: Obter a Connection String

Após o banco ser criado:

1. Vá em **"Info"** no menu lateral
2. Copie a **"Internal Database URL"** (formato: `postgresql://user:password@host:port/database`)
3. Guarde essa URL - você vai precisar dela!

Exemplo:
```
postgresql://restaurantuser:xxxxxxxxxxx@dpg-xxxxxxxxxxxxx/ssdb
```

### Passo 3: Criar as Tabelas

Você tem duas opções:

#### Opção A: Via PGAdmin (Recomendado)
1. Use as credenciais fornecidas pelo Render
2. Conecte-se ao banco usando PGAdmin
3. Execute o script SQL do projeto: `db.sql`

#### Opção B: Via SQL Shell do Render
1. No dashboard do banco, clique em **"Connect"** → **"External Connection"**
2. Use o comando PSQL fornecido
3. Execute o conteúdo do arquivo `db.sql`

## 🐳 Parte 2: Deploy da API ASP.NET

### Passo 1: Preparar o Repositório

Certifique-se de que seu código está no GitHub com:
- ✅ Dockerfile na pasta `ASP.NET API/somandosabores.api/`
- ✅ .dockerignore configurado
- ✅ Todos os arquivos commitados

### Passo 2: Criar Web Service no Render

1. No Render Dashboard, clique em **"New +"** → **"Web Service"**

2. Conecte seu repositório GitHub:
   - Clique em **"Connect a repository"**
   - Autorize o Render a acessar seu GitHub
   - Selecione: `Bruno441/Somando-Sabores---Projeto`

3. Configure o serviço:

   **Basic Settings:**
   - **Name**: `somando-sabores-api`
   - **Region**: Mesma do banco de dados
   - **Branch**: `main`
   - **Root Directory**: `ASP.NET API`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `somandosabores.api/Dockerfile`

   **Plan:**
   - Escolha **Free** para testes (512 MB RAM, suspende após inatividade)

4. Clique em **"Advanced"** e configure:

### Passo 3: Configurar Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente:

```bash
# Connection String (use a Internal Database URL do Render)
ConnectionStrings__DefaultConnection=postgresql://user:password@host:port/ssdb

# Ou use formato alternativo:
CONNECTION_STRING=Host=dpg-xxxxx.oregon-postgres.render.com;Port=5432;Database=ssdb;Username=restaurantuser;Password=xxxxx;SSL Mode=Require

# Asaas API (mesmo do appsettings.json)
Asaas__BaseUrl=https://sandbox.asaas.com/api/v3/
Asaas__ApiKey=$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmRiN2E4MWYzLTgyMDktNDEyMC1hZDFmLTJjZDQ5MzFlYTY4Mjo6JGFhY2hfNTU2MjNiZGYtZmU3YS00MTViLWFiNjEtNWIwMzk1NmYxN2Q2

# Ambiente
ASPNETCORE_ENVIRONMENT=Production
```

**⚠️ IMPORTANTE**: Substitua os valores `xxxxx` pela sua connection string real do Render!

### Passo 4: Configurar CORS para Produção

Antes de fazer o deploy, você precisa atualizar o CORS no código:

No arquivo `Program.cs`, descomente a linha de produção:

```csharp
builder.Services.AddCors(options => {
    options.AddPolicy("AllowSpecificOrigin", 
    builder => {
        builder.WithOrigins(
            "http://localhost:4200",
            "https://somando-sabores-projeto.vercel.app"  // ← Descomente esta linha
        )
        .WithHeaders("Content-Type", "Authorization")
        .WithMethods("GET", "POST", "PUT", "DELETE");
    });
});
```

### Passo 5: Deploy!

1. Clique em **"Create Web Service"**
2. Aguarde o build (pode levar 5-10 minutos na primeira vez)
3. Acompanhe os logs em tempo real

### Passo 6: Testar a API

Após o deploy bem-sucedido, você receberá uma URL tipo:
```
https://somando-sabores-api.onrender.com
```

Teste os endpoints:
- **Health**: `https://somando-sabores-api.onrender.com/`
- **Swagger**: `https://somando-sabores-api.onrender.com/swagger` (se habilitado)
- **Reservas**: `https://somando-sabores-api.onrender.com/api/Reserva`

## 🔧 Troubleshooting

### Erro: "Failed to connect to database"

**Solução:**
1. Verifique se a connection string está correta
2. Certifique-se de usar a **Internal Database URL**
3. Adicione `SSL Mode=Require` na connection string

### Erro: "Application failed to start"

**Solução:**
1. Verifique os logs no Render Dashboard
2. Confirme se o Dockerfile está no caminho correto
3. Verifique se todas as variáveis de ambiente estão configuradas

### API lenta para responder

**Causa:** No plano Free, o Render suspende serviços inativos após 15 minutos.

**Solução:**
- A primeira requisição após suspensão demora ~30 segundos
- Para produção, considere upgradar para plano pago

### CORS Error

**Solução:**
1. Verifique se a URL do frontend está no `WithOrigins()`
2. Faça commit e redeploy após alterar o CORS

## 📝 Checklist Final

- [ ] Banco de dados PostgreSQL criado no Render
- [ ] Connection string copiada e salva
- [ ] Tabelas criadas no banco (via SQL)
- [ ] Web Service criado e conectado ao GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] CORS atualizado com URL do frontend
- [ ] Código commitado no GitHub
- [ ] Deploy realizado com sucesso
- [ ] API testada e funcionando

## 🔄 Atualizar Frontend para Usar a API do Render

Após o deploy, atualize o frontend:

**No arquivo `reserva.service.ts`:**
```typescript
// Antes (desenvolvimento)
private urlApi = 'http://localhost:5000/api/Reserva';

// Depois (produção)
private urlApi = 'https://somando-sabores-api.onrender.com/api/Reserva';
```

Ou melhor, use variáveis de ambiente no Angular.

## 💰 Custos

### Plano Free:
- **PostgreSQL**: 256 MB de storage, 97 horas/mês (~30 dias)
- **Web Service**: 512 MB RAM, suspende após 15 min de inatividade
- **Custo**: $0/mês

### Plano Pago (Starter):
- **PostgreSQL**: $7/mês (1 GB storage, sempre ativo)
- **Web Service**: $7/mês (512 MB RAM, sempre ativo)
- **Custo Total**: ~$14/mês

## 🚀 Próximos Passos

1. Fazer deploy do frontend no Vercel (já está configurado)
2. Configurar domínio customizado (opcional)
3. Monitorar logs e performance
4. Configurar backup do banco de dados (plano pago)

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Dashboard do Render
2. Consulte a documentação: https://render.com/docs
3. Verifique a connection string e variáveis de ambiente

---

**Boa sorte com o deploy! 🎉**
