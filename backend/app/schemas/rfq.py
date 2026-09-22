from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class RFQCreate(BaseModel):
    product_name: str = Field(min_length=2, max_length=150)
    description: str = Field(min_length=5)
    quantity: int = Field(gt=0)
    delivery_location: str = Field(min_length=2, max_length=255)
    deadline: datetime

    @field_validator("deadline")
    @classmethod
    def validate_deadline(cls, value: datetime):
        if value <= datetime.now():
            raise ValueError("Deadline must be in the future")
        return value


class RFQResponse(BaseModel):
    id: int
    buyer_id: int
    product_name: str
    description: str
    quantity: int
    delivery_location: str
    deadline: datetime
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class RFQUpdate(BaseModel):
    product_name: str = Field(
        min_length=2,
        max_length=150
    )

    description: str = Field(
        min_length=5
    )

    quantity: int = Field(
        gt=0
    )

    delivery_location: str = Field(
        min_length=2,
        max_length=255
    )

    deadline: datetime

    @field_validator("deadline")
    @classmethod
    def validate_deadline(cls, value: datetime):
        if value <= datetime.now():
            raise ValueError("Deadline must be in the future")

        return value