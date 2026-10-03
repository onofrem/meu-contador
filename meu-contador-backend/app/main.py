import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import get_db, initialize_database
from .models import CounterState
from .schemas import CounterResponse, LimitsUpdate

load_dotenv()


def serialize_counter(counter: CounterState) -> CounterResponse:
    return CounterResponse(
        count=counter.count,
        min=counter.min_value,
        max=counter.max_value,
    )


def get_counter_state(session: Session) -> CounterState:
    counter = session.get(CounterState, 1)
    if counter is None:
        raise HTTPException(status_code=500, detail="Counter state is not initialized.")
    return counter


@asynccontextmanager
async def lifespan(_app: FastAPI):
    initialize_database()
    yield


app = FastAPI(
    title="Meu Contador API",
    description="API for reading and updating the shared counter state.",
    version="1.0.0",
    lifespan=lifespan,
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/counter", response_model=CounterResponse)
def read_counter(session: Session = Depends(get_db)):
    return serialize_counter(get_counter_state(session))


@app.post("/api/counter/increment", response_model=CounterResponse)
def increment_counter(session: Session = Depends(get_db)):
    counter = get_counter_state(session)
    counter.count = min(counter.max_value, counter.count + 1)
    session.commit()
    session.refresh(counter)
    return serialize_counter(counter)


@app.post("/api/counter/decrement", response_model=CounterResponse)
def decrement_counter(session: Session = Depends(get_db)):
    counter = get_counter_state(session)
    counter.count = max(counter.min_value, counter.count - 1)
    session.commit()
    session.refresh(counter)
    return serialize_counter(counter)


@app.post("/api/counter/reset", response_model=CounterResponse)
def reset_counter(session: Session = Depends(get_db)):
    counter = get_counter_state(session)
    counter.count = min(counter.max_value, max(counter.min_value, 0))
    session.commit()
    session.refresh(counter)
    return serialize_counter(counter)


@app.put("/api/counter/limits", response_model=CounterResponse)
def update_limits(payload: LimitsUpdate, session: Session = Depends(get_db)):
    counter = get_counter_state(session)
    counter.min_value = payload.min
    counter.max_value = payload.max
    counter.count = min(payload.max, max(payload.min, counter.count))
    session.commit()
    session.refresh(counter)
    return serialize_counter(counter)
