from groq import Groq

from app.config import GROQ_API_KEY, GROQ_MODEL


if not GROQ_API_KEY:
    raise ValueError(
        "GROQ_API_KEY is missing. "
        "Add it to the backend/.env file."
    )


client = Groq(
    api_key=GROQ_API_KEY
)


def analyze_complaint(complaint_text: str):

    prompt = f"""
You are an AI assistant for a pharmaceutical
Customer Complaint Management System.

Analyze the complaint below.

Return ONLY valid JSON.

Required JSON structure:

{{
    "source": null,
    "category": null,
    "customer_name": null,
    "organization": null,
    "product_name": null,
    "material_type": null,
    "dosage_form": null,
    "strength": null,
    "batch_number": null,
    "manufacture_date": null,
    "expiration_date": null,
    "category": null,
    "description": null,
    "risk_level": null,
    "risk_reason": null,
    "missing_fields": []
}}

IMPORTANT:
- Do not invent information.
- If information is not present, use null.
- missing_fields must contain fields that are required
  but could not be identified.
- risk_level must be one of:
  LOW, MEDIUM, HIGH, CRITICAL.

Customer complaint:

{complaint_text}
"""

    response = client.chat.completions.create(
        model=GROQ_MODEL,

        messages=[
            {
                "role": "system",
                "content": (
                    "You are a pharmaceutical quality "
                    "management AI assistant."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],

        temperature=0.1,
    )

    return response.choices[0].message.content