from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class BaseStatusBase(BaseModel):
    airport_iata: str = Field(..., min_length=3, max_length=3)
    valid_from: datetime
    valid_to: Optional[datetime] = None
    seasonality: str = Field(default="PERMANENT")
    season_pattern: Optional[str] = None
    notes: Optional[str] = None


class BaseStatusCreate(BaseStatusBase):
    created_by: str


class BaseStatusUpdate(BaseModel):
    valid_from: Optional[datetime] = None
    valid_to: Optional[datetime] = None
    seasonality: Optional[str] = None
    season_pattern: Optional[str] = None
    notes: Optional[str] = None
    updated_by: str


class BaseStatusResponse(BaseStatusBase):
    model_config = ConfigDict(from_attributes=True)

    base_id: int
    created_at: datetime
    created_by: str
    updated_at: datetime
    updated_by: str
