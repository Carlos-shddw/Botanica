# Configuração Firebase

A aplicação usa Firebase Authentication para contas com email/palavra-passe e início de sessão Google, e Cloud Firestore para guardar o jardim de cada utilizador.

## Preparar o projeto

1. Na consola Firebase do projeto `botanica-cc0bf`, abre **Authentication → Sign-in method** e ativa **Email/Password** e **Google**.
2. Cria uma base de dados em **Firestore Database**.
3. Publica as regras de `firestore.rules`. Cada utilizador autenticado só pode ler e gerir os documentos em `users/{uid}/plants/{id}` cujo `uid` coincide com o seu. A criação valida o esquema dos registos e a edição só permite alterar os campos de rega (`wateringIntervalDays`, `nextWateringDate` e `lastWateredAt`); os restantes dados da planta ficam imutáveis depois de criada. A eliminação também só é permitida ao proprietário. Os restantes caminhos são negados por omissão. Podes colar o conteúdo no separador **Rules** da base de dados e carregar em **Publish**, ou usar a CLI:

   ```sh
   firebase login
   firebase deploy --only firestore:rules
   ```

   O ficheiro `.firebaserc` já seleciona o projeto `botanica-cc0bf`. Para usar a CLI, instala o Node.js (inclui npm) e depois `firebase-tools` com `npm install -g firebase-tools`. A CLI não é necessária se publicares as regras pela consola.

4. Em **Authentication → Settings → Authorized domains**, confirma que o domínio onde a aplicação vai correr está autorizado. Para desenvolvimento local, adiciona `localhost` se necessário.
5. Serve a aplicação por HTTPS ou `localhost`; módulos JavaScript e Authentication não funcionam corretamente ao abrir diretamente o ficheiro `index.html`.

O `apiKey` no módulo `assets/js/firebase.js` é a configuração pública da aplicação Web, não uma chave privada de conta de serviço. Nunca coloques credenciais de conta de serviço no cliente.

Os dados antigos guardados no navegador (contas de demonstração e IndexedDB) não são migrados automaticamente para o Firebase.
