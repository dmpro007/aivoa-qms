from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class Complaint(Base):

    __tablename__ = "complaints"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    # Customer information

    customer_name = Column(
        String(255),
        nullable=True
    )

    organization = Column(
        String(255),
        nullable=True
    )

    email = Column(
        String(255),
        nullable=True
    )

    country = Column(
        String(100),
        nullable=True
    )


    # Product information

    product_name = Column(
        String(255),
        nullable=True
    )

    material_type = Column(
        String(50),
        nullable=True
    )

    dosage_form = Column(
        String(100),
        nullable=True
    )

    strength = Column(
        String(100),
        nullable=True
    )

    batch_number = Column(
        String(100),
        nullable=True
    )


    # Complaint information

    category = Column(
        String(100),
        nullable=True
    )

    description = Column(
        Text,
        nullable=True
    )


    # AI assessment

    risk_level = Column(
        String(50),
        nullable=True
    )

    risk_score = Column(
        Integer,
        nullable=True
    )

    risk_reason = Column(
        Text,
        nullable=True
    )

    completeness_score = Column(
        Integer,
        nullable=True
    )

    summary = Column(
        Text,
        nullable=True
    )


    # AI recommendations

    root_cause_suggestions = Column(
        Text,
        nullable=True
    )

    capa_recommendations = Column(
        Text,
        nullable=True
    )


    # Status

    status = Column(
        String(50),
        default="Draft"
    )


    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )