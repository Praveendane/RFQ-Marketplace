from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class QuotationCreate(BaseModel):
    price: Decimal = Field(
        gt=0,
        max_digits=12,
        decimal_places=2
    )

    estimated_delivery_time: str = Field(
        min_length=2,
        max_length=100
    )

    notes: str | None = Field(
        default=None,
        max_length=1000
    )


class QuotationResponse(BaseModel):
    id: int
    rfq_id: int
    supplier_id: int
    price: Decimal
    estimated_delivery_time: str
    notes: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }