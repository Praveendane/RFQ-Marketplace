from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.models.quotation import Quotation
from app.models.rfq import RFQ
from app.schemas.quotation import (
    QuotationCreate,
    QuotationResponse
)
from database import get_db


router = APIRouter(
    prefix="/quotations",
    tags=["Quotations"]
)


@router.post(
    "/rfq/{rfq_id}",
    response_model=QuotationResponse,
    status_code=status.HTTP_201_CREATED
)
def create_quotation(
    rfq_id: int,
    quotation_data: QuotationCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.get("role") != "supplier":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only suppliers can submit quotations"
        )

    rfq = db.query(RFQ).filter(
        RFQ.id == rfq_id
    ).first()

    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found"
        )

    quotation = Quotation(
        rfq_id=rfq.id,
        supplier_id=int(current_user["sub"]),
        price=quotation_data.price,
        estimated_delivery_time=quotation_data.estimated_delivery_time,
        notes=quotation_data.notes
    )

    db.add(quotation)
    db.commit()
    db.refresh(quotation)

    return quotation

@router.get(
    "/my",
    response_model=list[QuotationResponse]
)
def get_my_quotations(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.get("role") != "supplier":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only suppliers can view their quotations"
        )

    quotations = db.query(Quotation).filter(
        Quotation.supplier_id == int(current_user["sub"])
    ).order_by(
        Quotation.created_at.desc()
    ).all()

    return quotations

@router.get(
    "/rfq/{rfq_id}",
    response_model=list[QuotationResponse]
)
def get_rfq_quotations(
    rfq_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.get("role") != "buyer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only buyers can view received quotations"
        )

    rfq = db.query(RFQ).filter(
        RFQ.id == rfq_id,
        RFQ.buyer_id == int(current_user["sub"])
    ).first()

    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found"
        )

    quotations = db.query(Quotation).filter(
        Quotation.rfq_id == rfq_id
    ).order_by(
        Quotation.created_at.desc()
    ).all()

    return quotations