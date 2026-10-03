import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./meu_contador.db")

engine_options = {}
if DATABASE_URL.startswith("sqlite"):
    engine_options["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_options)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def initialize_database():
    from . import models

    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        if session.get(models.CounterState, 1) is None:
            session.add(models.CounterState(id=1, count=0, min_value=0, max_value=10))
            session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
