from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.models.rfq import RFQ
from app.schemas.rfq import RFQCreate, RFQResponse, RFQUpdate
from database import get_db


router = APIRouter(
    prefix="/rfqs",
    tags=["RFQs"]
)


@router.post(
    "",
    response_model=RFQResponse,
    status_code=status.HTTP_201_CREATED
)
def create_rfq(
    rfq_data: RFQCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.get("role") != "buyer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only buyers can create RFQs"
        )

    rfq = RFQ(
        buyer_id=int(current_user["sub"]),
        product_name=rfq_data.product_name,
        description=rfq_data.description,
        quantity=rfq_data.quantity,
        delivery_location=rfq_data.delivery_location,
        deadline=rfq_data.deadline
    )

    db.add(rfq)
    db.commit()
    db.refresh(rfq)

    return rfq


@router.get(
    "/my",
    response_model=list[RFQResponse]
)
def get_my_rfqs(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.get("role") != "buyer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only buyers can view their RFQs"
        )

    rfqs = db.query(RFQ).filter(
        RFQ.buyer_id == int(current_user["sub"])
    ).order_by(
        RFQ.created_at.desc()
    ).all()

    return rfqs

@router.get(
    "",
    response_model=list[RFQResponse]
)
def browse_rfqs(
    search: str | None = None,
    location: str | None = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.get("role") != "supplier":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only suppliers can browse RFQs"
        )

    query = db.query(RFQ)

    if search:
        query = query.filter(
            RFQ.product_name.ilike(f"%{search}%")
        )

    if location:
        query = query.filter(
            RFQ.delivery_location.ilike(f"%{location}%")
        )

    rfqs = query.order_by(
        RFQ.created_at.desc()
    ).all()

    return rfqs

@router.get(
    "/{rfq_id}",
    response_model=RFQResponse
)
def get_rfq_details(
    rfq_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.get("role") != "supplier":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only suppliers can view RFQ details"
        )

    rfq = db.query(RFQ).filter(
        RFQ.id == rfq_id
    ).first()

    if not rfq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RFQ not found"
        )

    return rfq

@router.put(
    "/{rfq_id}",
    response_model=RFQResponse
)
def update_rfq(
    rfq_id: int,
    rfq_data: RFQUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.get("role") != "buyer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only buyers can update RFQs"
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

    rfq.product_name = rfq_data.product_name
    rfq.description = rfq_data.description
    rfq.quantity = rfq_data.quantity
    rfq.delivery_location = rfq_data.delivery_location
    rfq.deadline = rfq_data.deadline

    db.commit()
    db.refresh(rfq)

    return rfq

@router.delete(
    "/{rfq_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_rfq(
    rfq_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.get("role") != "buyer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only buyers can delete RFQs"
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

    db.delete(rfq)
    db.commit()

    return None