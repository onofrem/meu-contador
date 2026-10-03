# Fluxo de desenvolvimento e promoção

Este projeto usa três ambientes lógicos:

| Ambiente | Representação | Uso |
| --- | --- | --- |
| DEV | Máquina local do desenvolvedor | Codificar, executar frontend/backend e validar mudanças |
| HML | Branch `HML` | Integrar e homologar mudanças para QA |
| PRD | Branch `PRD` | Manter a versão aprovada para produção |

DEV é um ambiente de trabalho, não uma branch permanente. Não faça commits
diretamente em `HML` ou `PRD`.

## Fluxo de uma funcionalidade

1. Atualize a branch HML local: `git switch HML` e `git pull`.
2. Crie uma branch de trabalho: `git switch -c feature/nome-curto` (ou
   `fix/nome-curto` para correções).
3. Desenvolva e teste no ambiente DEV. Para este projeto, execute:
   - Frontend: `npm test -- --watchAll=false --runInBand` e `npm run build`.
   - Backend, dentro de `meu-contador-backend`: `python -m unittest discover -s tests -v`.
4. Envie a branch ao GitHub e abra um pull request para `HML`.
5. Aguarde o CI passar e faça a homologação/QA em HML. Corrija qualquer
   problema por commits na branch do PR.
6. Após aprovação de QA, abra um pull request de `HML` para `PRD`. Revise o
   diff e aguarde o CI antes do merge.
7. Deploy não é automático neste projeto. Execute o procedimento de deploy
   aprovado para o ambiente de produção, quando definido.

## Hotfix de produção

1. Crie `hotfix/nome-curto` a partir de `PRD`.
2. Faça a correção e execute os testes no DEV.
3. Abra PR para `PRD`, aguarde CI e aprovação.
4. Depois de integrar em PRD, integre a correção de volta em HML por PR de
   `PRD` para `HML`, para evitar divergência entre ambientes.

## CI e proteção no GitHub

O workflow `.github/workflows/ci.yml` é executado em PRs para `HML` e `PRD` e
em pushes nessas branches. Ele instala dependências e executa os testes do
frontend, build de produção e testes do backend com SQLite temporário.

Depois de publicar o repositório no GitHub:

1. Crie/garanta as branches `HML` e `PRD`.
2. Em **Settings → Branches** (ou **Rules → Rulesets**), proteja ambas.
3. Exija pull request antes de integrar e o check `CI / frontend` e
   `CI / backend` bem-sucedidos.
4. Considere exigir aprovação de QA para PRs destinados a `PRD`.
5. Não configure deploy automático até definir os ambientes de destino,
   estratégia de publicação e segredos necessários.

Este repositório ainda requer conexão a um remoto GitHub para publicar branches
e habilitar as regras de proteção.
