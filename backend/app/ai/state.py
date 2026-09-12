from typing import TypedDict, List


class ComplaintState(TypedDict, total=False):

    # Original complaint
    raw_text: str

    # AI extracted information
    extracted_fields: dict

    # Completeness
    missing_fields: List[str]
    completeness_score: int

    # Risk assessment
    risk_level: str
    risk_score: int
    risk_reason: str

    # Root cause analysis
    root_cause_suggestions: List[str]

    # CAPA recommendations
    capa_recommendations: List[str]

    # Final summary
    summary: str


# from typing import TypedDict, Optional, List


# class ComplaintState(TypedDict, total=False):

#     # Original complaint
#     raw_text: str

#     # AI extracted information
#     extracted_fields: dict

#     # Missing required information
#     missing_fields: List[str]

#     # Completeness
#     completeness_score: int

#     # Risk assessment
#     risk_level: str
#     risk_score: int
#     risk_reason: str

#     # Final AI summary
#     summary: str

#     root_cause_suggestions: list
# capa_recommendations: list