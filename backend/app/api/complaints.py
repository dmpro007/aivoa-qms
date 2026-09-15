from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.database import get_db
from app.database.models import Complaint


router = APIRouter(
    prefix="/api/complaints",
    tags=["Complaints"]
)


class ComplaintCreate(BaseModel):

    source: str | None = None
    customerName: str | None = None
    organization: str | None = None
    email: str | None = None
    country: str | None = None

    productName: str | None = None
    materialType: str | None = None
    dosageForm: str | None = None
    strength: str | None = None
    batchNumber: str | None = None
    manufacture_date: str | None = None
    expiration_date: str | None = None

    category: str | None = None
    description: str | None = None

    riskLevel: str | None = None
    riskScore: int | None = None
    riskReason: str | None = None

    completenessScore: int | None = None

    summary: str | None = None

    rootCauseSuggestions: list[str] = []
    capaRecommendations: list[str] = []


@router.post("")
def create_complaint(
    complaint_data: ComplaintCreate,
    db: Session = Depends(get_db)
):

    complaint = Complaint(

        source=complaint_data.source,
        customer_name=complaint_data.customerName,
        organization=complaint_data.organization,
        email=complaint_data.email,
        country=complaint_data.country,

        product_name=complaint_data.productName,
        material_type=complaint_data.materialType,
        dosage_form=complaint_data.dosageForm,
        strength=complaint_data.strength,
        batch_number=complaint_data.batchNumber,
        manufacture_date=complaint_data.manufacture_date,
        expiration_date=complaint_data.expiration_date,

        category=complaint_data.category,
        description=complaint_data.description,

        risk_level=complaint_data.riskLevel,
        risk_score=complaint_data.riskScore,
        risk_reason=complaint_data.riskReason,

        completeness_score=complaint_data.completenessScore,

        summary=complaint_data.summary,

        root_cause_suggestions="\n".join(
            complaint_data.rootCauseSuggestions
        ),

        capa_recommendations="\n".join(
            complaint_data.capaRecommendations
        ),

        status="Committed"
    )

    db.add(complaint)

    db.commit()

    db.refresh(complaint)

    return {
        "success": True,
        "message": "Complaint saved successfully",
        "complaint_id": complaint.id
    }

@router.get("")
def get_complaints(
    db: Session = Depends(get_db)
):
    complaints = (
        db.query(Complaint)
        .order_by(Complaint.created_at.desc())
        .all()
    )

    return {
        "success": True,
        "data": [
            {
                "id": complaint.id,
                "customer_name": complaint.customer_name,
                "organization": complaint.organization,
                "product_name": complaint.product_name,
                "category": complaint.category,
                "risk_level": complaint.risk_level,
                "risk_score": complaint.risk_score,
                "status": complaint.status,
                "created_at": complaint.created_at,
            }
            for complaint in complaints
        ]
    }

@router.get("/stats/{complaint_id}")
def get_complaint(
    complaint_id: int,
    db: Session = Depends(get_db)
):
    complaint = (
        db.query(Complaint)
        .filter(Complaint.id == complaint_id)
        .first()
    )

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    return {
        "success": True,
        "data": {
            "id": complaint.id,
            "complaint_source": complaint.complaint_source,
            "complaint_category": complaint.complaint_category,
            "customer_name": complaint.customer_name,
            "organization": complaint.organization,
            "email": complaint.email,
            "country": complaint.country,

            "product_name": complaint.product_name,
            "material_type": complaint.material_type,
            "dosage_form": complaint.dosage_form,
            "strength": complaint.strength,
            "batch_number": complaint.batch_number,
            "manufacture_date": complaint.manufacture_date,
            "expiration_date": complaint.expiration_date,

            "category": complaint.category,
            "description": complaint.description,

            "risk_level": complaint.risk_level,
            "risk_score": complaint.risk_score,
            "risk_reason": complaint.risk_reason,
            "completeness_score": complaint.completeness_score,

            "summary": complaint.summary,

            "root_cause_suggestions": (
                complaint.root_cause_suggestions.split("\n")
                if complaint.root_cause_suggestions
                else []
            ),

            "capa_recommendations": (
                complaint.capa_recommendations.split("\n")
                if complaint.capa_recommendations
                else []
            ),

            "status": complaint.status,
            "created_at": complaint.created_at,
        }
    }

@router.get("/stats")
def get_complaint_stats(
    db: Session = Depends(get_db)
):
    complaints = db.query(Complaint).all()

    total = len(complaints)

    high_risk = sum(
        1
        for complaint in complaints
        if complaint.risk_level in ["HIGH", "CRITICAL"]
    )

    open_complaints = sum(
        1
        for complaint in complaints
        if complaint.status not in ["Closed"]
    )

    completeness_values = [
        complaint.completeness_score
        for complaint in complaints
        if complaint.completeness_score is not None
    ]

    average_completeness = (
        round(
            sum(completeness_values)
            / len(completeness_values)
        )
        if completeness_values
        else 0
    )

    return {
        "success": True,
        "data": {
            "total": total,
            "high_risk": high_risk,
            "open": open_complaints,
            "average_completeness": average_completeness
        }
    }