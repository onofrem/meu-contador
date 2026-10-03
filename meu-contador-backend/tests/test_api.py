import unittest
from tempfile import TemporaryDirectory
from unittest.mock import patch

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app


class CounterApiTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = TemporaryDirectory()
        self.engine = create_engine(
            f"sqlite:///{self.temp_dir.name}/test.db",
            connect_args={"check_same_thread": False},
        )
        self.session_factory = sessionmaker(
            bind=self.engine,
            autoflush=False,
            expire_on_commit=False,
        )
        self.engine_patch = patch("app.database.engine", self.engine)
        self.session_patch = patch("app.database.SessionLocal", self.session_factory)
        self.engine_patch.start()
        self.session_patch.start()
        self.client_context = TestClient(app)
        self.client = self.client_context.__enter__()

    def tearDown(self):
        self.client_context.__exit__(None, None, None)
        self.session_patch.stop()
        self.engine_patch.stop()
        self.engine.dispose()
        self.temp_dir.cleanup()

    def test_counter_operations_and_limits(self):
        self.assertEqual(
            self.client.get("/api/counter").json(),
            {"count": 0, "min": 0, "max": 10},
        )
        self.assertEqual(
            self.client.post("/api/counter/increment").json()["count"],
            1,
        )
        self.assertEqual(
            self.client.put(
                "/api/counter/limits",
                json={"min": -2, "max": 2},
            ).json(),
            {"count": 1, "min": -2, "max": 2},
        )
        self.assertEqual(
            self.client.post("/api/counter/reset").json(),
            {"count": 0, "min": -2, "max": 2},
        )
        self.assertEqual(
            self.client.post("/api/counter/decrement").json()["count"],
            -1,
        )

    def test_invalid_limits_are_rejected(self):
        response = self.client.put(
            "/api/counter/limits",
            json={"min": 5, "max": 5},
        )
        self.assertEqual(response.status_code, 422)
