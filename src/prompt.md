# Prompt de continuidade — Meu Contador

Use este prompt como contexto para futuras alterações neste sistema. Antes de
editar, confira o código atual e preserve a arquitetura, funcionalidades e
decisões descritas aqui. Se o código tiver mudado, trate os arquivos existentes
como fonte da verdade e atualize este documento quando uma alteração relevante
modificar o estado do projeto.

## Objetivo do sistema

Aplicação web de contador com interface React e API independente em Python. O
frontend não mantém o contador como fonte de verdade: ele consulta e altera o
estado compartilhado pela API. O backend persiste o contador e seus limites em
banco de dados.

O projeto principal na raiz contém o frontend. O backend separado fica em
`meu-contador-backend\`.

## Ambientes Git e promoção de código

- **DEV** é o ambiente local na máquina do desenvolvedor, não uma branch.
- **HML** é a branch de homologação/QA. Features e correções são desenvolvidas
  localmente em branches `feature/*` ou `fix/*`, criadas a partir de HML, e
  chegam a HML por pull request e CI.
- **PRD** é a branch de produção. Promova código validado em HML por pull
  request de `HML` para `PRD`; não faça push direto nessas branches.
- Hotfixes podem partir de PRD em branches `hotfix/*`, devem passar por PR e CI
  para PRD e depois ser integrados de volta em HML.
- O workflow GitHub Actions verifica frontend e backend nos PRs para HML e
  PRD. Deploy automático não está configurado; definir infraestrutura,
  destinos e segredos de deploy exige decisão específica.
- Ative no GitHub proteção das branches `HML` e `PRD`, exigindo pull request e
  check de CI bem-sucedido. Veja `CONTRIBUTING.md`.

## Funcionalidades existentes

- Exibir um contador com valor padrão `0` e intervalo inicial de `0` a `10`.
- Incrementar ou decrementar em uma unidade, sem ultrapassar os limites.
- Resetar para `0`, ajustado ao intervalo atual quando zero estiver fora dele.
- Editar os limites mínimo e máximo e aplicá-los explicitamente. O mínimo deve
  ser menor que o máximo; ao alterá-los, o backend mantém o contador dentro do
  novo intervalo.
- Mostrar progresso percentual entre mínimo e máximo.
- Alternar a interface entre temas escuro e claro.
- Alternar o idioma entre Português do Brasil (`pt-BR`) e Inglês americano
  (`en-US`), inclusive rótulos, acessibilidade, validações, mensagens de API,
  título do documento, idioma do HTML e formatação numérica.
- Layout responsivo para celulares, telas estreitas e áreas seguras de
  dispositivos móveis; animações respeitam `prefers-reduced-motion`.
- Estados de carregamento, falha de conexão com a API e opção para tentar
  novamente.
- Acessibilidade com rótulos apropriados, foco visível, `aria-live`,
  `progressbar` e estado inválido nos campos de limites.

## Tecnologias e arquitetura

### Frontend

- Create React App, React e JavaScript.
- Ponto de entrada: `src\index.js`.
- Interface e alternância de tema/idioma: `src\App.js`.
- Contador e integração das ações: `src\Contador.js`.
- Traduções: `src\i18n.js`.
- Cliente HTTP baseado em `fetch`: `src\api.js`.
- Estilos globais: `src\index.css`; estilos da interface: `src\App.css`.
- Testes de interface e integração HTTP: `src\App.test.js`.
- URL base da API: variável `REACT_APP_API_URL`; padrão
  `http://127.0.0.1:8000`. A URL é definida no build/start do frontend.
- Alvos de compilação em `package.json` incluem as duas versões mais recentes
  de Chrome, Edge, Firefox, Safari e iOS Safari.

### Backend

- Projeto Python independente em `meu-contador-backend\`.
- FastAPI e Uvicorn servem a API; SQLAlchemy abstrai a persistência.
- Pydantic valida os dados de limites e documenta os formatos da API.
- SQLite é o banco padrão; SQL Server é suportado via SQLAlchemy, `pyodbc` e
  Microsoft ODBC Driver 18.
- `DATABASE_URL` seleciona a conexão. Sem essa variável, usa
  `sqlite:///./meu_contador.db` (arquivo relativo ao diretório de execução do
  backend).
- `FRONTEND_ORIGINS` configura uma lista de origens CORS separadas por vírgula.
  O padrão permite `http://localhost:3000` e `http://127.0.0.1:3000`.
- A tabela `counter_state` contém uma única linha compartilhada, com `id = 1`,
  valor atual e limites. No primeiro start, o backend cria as tabelas e
  inicializa essa linha com `count=0`, `min=0`, `max=10`.
- Restrições no banco exigem `min_value < max_value` e contador dentro dos
  limites.
- `GET /docs` disponibiliza a documentação interativa do FastAPI.

## Contrato da API

As respostas bem-sucedidas das operações de contador têm o formato:

```json
{
  "count": 0,
  "min": 0,
  "max": 10
}
```

| Método | Rota | Resultado |
| --- | --- | --- |
| `GET` | `/health` | Estado de disponibilidade, por exemplo `{"status":"ok"}` |
| `GET` | `/api/counter` | Lê valor e limites atuais |
| `POST` | `/api/counter/increment` | Incrementa até o máximo |
| `POST` | `/api/counter/decrement` | Decrementa até o mínimo |
| `POST` | `/api/counter/reset` | Define zero, limitado ao intervalo atual |
| `PUT` | `/api/counter/limits` | Atualiza limites usando JSON `{"min":0,"max":10}` |

Os limites precisam ser inteiros seguros para JavaScript e respeitar
`min < max`. Dados inválidos são rejeitados com HTTP `422`.

## Como executar no Windows

Frontend, a partir da raiz do repositório:

```powershell
npm install
npm start
```

Backend, em outro terminal, a partir da raiz:

```powershell
cd .\meu-contador-backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Frontend: `http://localhost:3000`. Backend: `http://127.0.0.1:8000`;
documentação: `http://127.0.0.1:8000/docs`.

Para SQL Server, configurar `DATABASE_URL` no `.env` do backend com uma URL
SQLAlchemy `mssql+pyodbc`, instalar o ODBC Driver 18, informar uma base já
existente e usar credenciais que possam criar/alterar tabelas. Reiniciar a API
após trocar o banco. Nunca gravar credenciais reais no repositório.

## Testes e build

Na raiz do frontend:

```powershell
npm test -- --watchAll=false --runInBand
npm run build
```

Backend, no diretório `meu-contador-backend`:

```powershell
python -m unittest discover -s tests -v
```

Os testes do backend usam SQLite temporário e cobrem operações do contador,
alteração de limites e rejeição de intervalo inválido. Os testes frontend
verificam a troca de idioma e uma chamada de incremento para a API.

## Fluxo de contribuição

Faça mudanças no ambiente DEV, crie uma branch `feature/*` ou `fix/*` a partir
de HML e abra um PR para HML. Depois de QA, promova por PR de HML para PRD.
Consulte `CONTRIBUTING.md` para o processo e as proteções de branch esperadas.

## Orientações para futuras alterações

- Implementar mudanças de estado persistente no backend e consumi-las pelo
  frontend através de `src\api.js`; não reintroduzir estado local como fonte
  autoritativa do contador.
- Preservar ambos os bancos suportados, compatibilidade multi-browser,
  comportamento responsivo, acessibilidade e os dois idiomas.
- Se adicionar textos visíveis ou acessíveis, incluir traduções em `src\i18n.js`
  para `pt-BR` e `en-US`.
- Validar entradas no frontend para usabilidade e no backend como autoridade.
- Manter as credenciais fora do controle de versão e configurar origens CORS
  explicitamente nos ambientes de produção.
- Adicionar ou atualizar testes para cada funcionalidade alterada; executar os
  testes pertinentes e o build antes de considerar a tarefa concluída.
