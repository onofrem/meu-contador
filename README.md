# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Python backend

The React app reads and updates the shared counter through the FastAPI service
in `meu-contador-backend`. Start the API separately from the frontend; it uses
SQLite by default and can be configured to use SQL Server. Setup, database
configuration, API routes, and backend tests are documented in
[`meu-contador-backend/README.md`](meu-contador-backend/README.md).

## Ambientes e fluxo de branches

- **DEV** é a máquina/ambiente local de desenvolvimento; não é uma branch.
- **HML** é a branch de homologação/QA.
- **PRD** é a branch de produção.
- Desenvolva em branches `feature/*` ou `fix/*` criadas a partir de `HML` e
  abra um PR para `HML`. Execute testes e validações de QA nessa etapa.
- Depois da aprovação em HML, abra um PR de `HML` para `PRD`. Não faça push
  direto para `HML` ou `PRD`.
- Correções urgentes podem partir de `PRD` em branches `hotfix/*`; após
  aprovação e validação em `PRD`, leve a correção de volta a `HML`.

O workflow do GitHub Actions executa testes/build do frontend e testes do
backend em PRs para `HML` e `PRD`. Ele não faz deploy: destinos e credenciais
de deploy ainda precisam ser definidos. Configure proteção das branches no
GitHub para exigir PR e o check de CI antes de permitir merge. Consulte
[`CONTRIBUTING.md`](CONTRIBUTING.md) para instruções detalhadas.
