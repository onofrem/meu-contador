# Meu Contador Backend

FastAPI service for the React counter. The counter and its limits are shared by
all frontend clients and persisted in the configured database.

## Run locally on Windows

From the repository root, create and activate a virtual environment, install the
backend requirements, and start the API:

```powershell
cd .\meu-contador-backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

By default, the API stores data in `meu_contador.db` in this directory using
SQLite. The API listens on `http://127.0.0.1:8000`; interactive documentation
is at `http://127.0.0.1:8000/docs`.

Run the React frontend separately from the repository root with `npm start`.
It calls `http://127.0.0.1:8000` by default. Set `REACT_APP_API_URL` before
starting/building the frontend to use a different API URL. Set
`FRONTEND_ORIGINS` in the backend `.env` to allow other browser origins.

## SQL Server

Install Microsoft ODBC Driver 18 for SQL Server. In `.env`, set `DATABASE_URL`
to a SQLAlchemy `mssql+pyodbc` URL, for example:

```text
DATABASE_URL=mssql+pyodbc://USER:PASSWORD@SERVER/DATABASE?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes
```

Replace the connection values and URL-encode special characters in credentials.
The database must already exist, and the configured SQL Server user needs
permission to create and update tables. Restart the API after changing the
database URL.

## API

All successful counter operations return `{ "count": ..., "min": ..., "max": ... }`.

| Method | Path | Behavior |
| --- | --- | --- |
| `GET` | `/api/counter` | Read counter and bounds |
| `POST` | `/api/counter/increment` | Increment, capped at maximum |
| `POST` | `/api/counter/decrement` | Decrement, capped at minimum |
| `POST` | `/api/counter/reset` | Reset to zero clamped to the current bounds |
| `PUT` | `/api/counter/limits` | Set integer bounds with JSON `{ "min": 0, "max": 10 }` |
| `GET` | `/health` | Check API availability |

Invalid limits (including `min >= max`) return HTTP 422.

## Tests

From this directory, run:

```powershell
python -m unittest discover -s tests -v
```
