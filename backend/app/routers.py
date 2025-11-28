from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .db import get_session
from . import models, schemas, services

router = APIRouter()


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


@router.get("/bases", response_model=list[schemas.BaseStatusResponse])
def list_bases(db: Session = Depends(get_session)):
    bases = db.query(models.BaseAirportStatus).all()
    return bases


@router.post("/bases", response_model=schemas.BaseStatusResponse, status_code=201)
def create_base(data: schemas.BaseStatusCreate, db: Session = Depends(get_session)):
    try:
        services.assert_no_overlap(db, data.airport_iata, data.valid_from, data.valid_to)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    airport = db.get(models.Airport, data.airport_iata)
    if not airport:
        raise HTTPException(status_code=400, detail="El aeropuerto no existe en el maestro")

    new_base = models.BaseAirportStatus(
        airport_iata=data.airport_iata,
        valid_from=data.valid_from,
        valid_to=data.valid_to,
        seasonality=data.seasonality,
        season_pattern=data.season_pattern,
        notes=data.notes,
        created_at=utc_now(),
        updated_at=utc_now(),
        created_by=data.created_by,
        updated_by=data.created_by,
    )
    db.add(new_base)
    db.commit()
    db.refresh(new_base)
    return new_base


@router.put("/bases/{base_id}", response_model=schemas.BaseStatusResponse)
def update_base(base_id: int, data: schemas.BaseStatusUpdate, db: Session = Depends(get_session)):
    base = db.get(models.BaseAirportStatus, base_id)
    if not base:
        raise HTTPException(status_code=404, detail="Periodo de base no encontrado")

    valid_from = data.valid_from or base.valid_from
    valid_to = data.valid_to if data.valid_to is not None else base.valid_to

    try:
        services.assert_no_overlap(db, base.airport_iata, valid_from, valid_to, exclude_base_id=base_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    base.valid_from = valid_from
    base.valid_to = valid_to
    base.seasonality = data.seasonality or base.seasonality
    base.season_pattern = data.season_pattern or base.season_pattern
    base.notes = data.notes or base.notes
    base.updated_at = utc_now()
    base.updated_by = data.updated_by

    db.add(base)
    db.commit()
    db.refresh(base)
    return base
