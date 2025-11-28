from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import select, and_, or_
from . import models


def assert_no_overlap(db: Session, airport_iata: str, valid_from: datetime, valid_to: datetime | None, exclude_base_id: int | None = None) -> None:
    if valid_to is not None and valid_from >= valid_to:
        raise ValueError("valid_from debe ser anterior a valid_to")

    query = select(models.BaseAirportStatus).where(models.BaseAirportStatus.airport_iata == airport_iata)
    if exclude_base_id is not None:
        query = query.where(models.BaseAirportStatus.base_id != exclude_base_id)

    if valid_to is None:
        overlap_condition = and_(
            or_(models.BaseAirportStatus.valid_to.is_(None), models.BaseAirportStatus.valid_to > valid_from),
            models.BaseAirportStatus.valid_from <= valid_from,
        )
    else:
        overlap_condition = and_(
            models.BaseAirportStatus.valid_from < valid_to,
            or_(models.BaseAirportStatus.valid_to.is_(None), models.BaseAirportStatus.valid_to > valid_from),
        )

    query = query.where(overlap_condition)
    existing = db.scalars(query).first()
    if existing:
        raise ValueError("Ya existe un periodo solapado para este aeropuerto")
