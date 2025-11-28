import os
from datetime import datetime, timedelta, timezone
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

os.environ.setdefault("BASE_APP_USE_SCHEMAS", "false")

from app.main import app  # noqa: E402
from app.db import Base, get_session  # noqa: E402
from app import models  # noqa: E402


def override_get_session():
    engine = create_engine("sqlite+pysqlite:///:memory:", connect_args={"check_same_thread": False}, future=True)
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    airport = models.Airport(airport_iata="VLC", name="Valencia", is_active=True)
    db.add(airport)
    db.commit()

    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_session] = override_get_session
client = TestClient(app)


def test_create_base_ok():
    payload = {
        "airport_iata": "VLC",
        "valid_from": datetime.now(timezone.utc).isoformat(),
        "valid_to": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
        "seasonality": "PERMANENT",
        "created_by": "tester@volotea.com",
    }
    response = client.post("/bases", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["airport_iata"] == "VLC"
    assert data["seasonality"] == "PERMANENT"


def test_create_base_overlap_error():
    now = datetime.now(timezone.utc)
    payload = {
        "airport_iata": "VLC",
        "valid_from": now.isoformat(),
        "valid_to": (now + timedelta(days=30)).isoformat(),
        "seasonality": "PERMANENT",
        "created_by": "tester@volotea.com",
    }
    response = client.post("/bases", json=payload)
    assert response.status_code == 201

    payload_overlap = {
        "airport_iata": "VLC",
        "valid_from": (now + timedelta(days=10)).isoformat(),
        "valid_to": (now + timedelta(days=40)).isoformat(),
        "seasonality": "PERMANENT",
        "created_by": "tester@volotea.com",
    }
    response_overlap = client.post("/bases", json=payload_overlap)
    assert response_overlap.status_code == 400
    assert "solapado" in response_overlap.json()["detail"]


def test_create_base_invalid_range_error():
    now = datetime.now(timezone.utc)
    payload = {
        "airport_iata": "VLC",
        "valid_from": now.isoformat(),
        "valid_to": (now - timedelta(days=1)).isoformat(),
        "seasonality": "PERMANENT",
        "created_by": "tester@volotea.com",
    }
    response = client.post("/bases", json=payload)
    assert response.status_code == 400
    assert "valid_from debe ser anterior" in response.json()["detail"]
