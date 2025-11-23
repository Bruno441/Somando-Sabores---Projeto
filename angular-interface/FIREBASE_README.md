# Configuração do Firebase Authentication

Para que a autenticação funcione, você precisa configurar um projeto no Firebase e adicionar as credenciais ao arquivo `.env` (ou variáveis de ambiente do sistema).

## 1. Criar Projeto no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/).
2. Clique em **"Adicionar projeto"** e siga os passos.
3. No menu lateral esquerdo, vá em **"Criação"** -> **"Authentication"**.
4. Clique em **"Vamos começar"**.
5. Na aba **"Sign-in method"**, ative o provedor **"E-mail/senha"**.

## 2. Obter Credenciais

1. No menu lateral esquerdo, clique no ícone de engrenagem (⚙️) ao lado de "Visão geral do projeto" e selecione **"Configurações do projeto"**.
2. Role a página até a seção **"Seus aplicativos"**.
3. Clique no ícone **Web** (`</>`).
4. Dê um apelido para o app (ex: "Somando Sabores Admin") e clique em **"Registrar app"**.
5. Copie os valores do objeto `firebaseConfig` que aparecerá.

## 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do diretório `angular-interface` (se não existir) ou adicione as seguintes variáveis com os valores obtidos no passo anterior:

```env
# Firebase Configuration
NG_APP_FIREBASE_API_KEY=sua_api_key
NG_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NG_APP_FIREBASE_PROJECT_ID=seu_project_id
NG_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NG_APP_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NG_APP_FIREBASE_APP_ID=seu_app_id
```

> **Nota:** Certifique-se de reiniciar a aplicação (`npm start`) após criar ou modificar o arquivo `.env` para que o script de configuração gere o arquivo `environment.ts` corretamente.

## 4. Criar Usuário Admin

Como o cadastro de usuários é restrito, você deve criar o primeiro usuário admin diretamente no Console do Firebase:

1. Vá em **Authentication** -> **Users**.
2. Clique em **"Adicionar usuário"**.
3. Digite o e-mail e senha desejados para o administrador.
4. Use essas credenciais para logar no painel administrativo.
