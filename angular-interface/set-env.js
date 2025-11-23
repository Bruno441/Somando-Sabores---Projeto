const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Carrega as variáveis do arquivo .env

// Caminho para o arquivo environment.ts que será gerado
const envFilePath = path.join(__dirname, 'src', 'environments', 'environment.ts');

// Conteúdo que será escrito no arquivo
const envFileContent = `
// Este arquivo é gerado automaticamente pelo script set-env.js. NÃO EDITE MANUALMENTE.
export const environment = {
  accessToken: '${process.env.NG_APP_ACCESS_TOKEN || ""}',
  urlWebhook: '${process.env.NG_APP_URL_WEBHOOK || ""}',
  firebase: {
    apiKey: '${process.env.NG_APP_FIREBASE_API_KEY || ""}',
    authDomain: '${process.env.NG_APP_FIREBASE_AUTH_DOMAIN || ""}',
    projectId: '${process.env.NG_APP_FIREBASE_PROJECT_ID || ""}',
    storageBucket: '${process.env.NG_APP_FIREBASE_STORAGE_BUCKET || ""}',
    messagingSenderId: '${process.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID || ""}',
    appId: '${process.env.NG_APP_FIREBASE_APP_ID || ""}'
  }
};
`;

// Escreve o conteúdo no arquivo
fs.writeFile(envFilePath, envFileContent, (err) => {
  if (err) {
    console.error(err);
    throw err;
  }
  console.log(`Arquivo de ambiente gerado com sucesso em ${envFilePath}`);
});
