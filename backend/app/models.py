from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Text, Boolean, BigInteger, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .db import Base


def utcnow():
    return datetime.now(timezone.utc)


class Airport(Base):
    __tablename__ = "airport"
    __table_args__ = {"schema": "ref"}

    airport_iata = Column(Text, primary_key=True)
    airport_icao = Column(Text)
    name = Column(Text, nullable=False)
    country = Column(Text)
    timezone = Column(Text)
    is_active = Column(Boolean, nullable=False, default=True, server_default="true")
    updated_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)

    bases = relationship("BaseAirportStatus", back_populates="airport")


class BaseAirportStatus(Base):
    __tablename__ = "base_airport_status"
    __table_args__ = {"schema": "ops"}

    base_id = Column(BigInteger, primary_key=True, autoincrement=True)
    airport_iata = Column(Text, ForeignKey("ref.airport.airport_iata"), nullable=False)
    valid_from = Column(DateTime(timezone=True), nullable=False)
    valid_to = Column(DateTime(timezone=True))
    seasonality = Column(Text, nullable=False, default="PERMANENT")
    season_pattern = Column(Text)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)
    created_by = Column(Text, nullable=False)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=utcnow, onupdate=utcnow)
    updated_by = Column(Text, nullable=False)

    airport = relationship("Airport", back_populates="bases")


class BaseAirportAudit(Base):
    __tablename__ = "base_airport_audit"
    __table_args__ = {"schema": "audit"}

    audit_id = Column(BigInteger, primary_key=True, autoincrement=True)
    base_id = Column(BigInteger)
    airport_iata = Column(Text, nullable=False)
    action = Column(Text, nullable=False)
    change_ts = Column(DateTime(timezone=True), nullable=False, default=utcnow)
    changed_by = Column(Text, nullable=False)
    old_row = Column(JSON)
    new_row = Column(JSON)
    request_ctx = Column(JSON)
