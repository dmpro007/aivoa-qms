import json

from app.ai.groq_client import client
from app.config import GROQ_MODEL
from app.ai.state import ComplaintState



def extract_complaint(state):

    complaint_text = state["raw_text"]

    prompt = f"""
You are a pharmaceutical quality complaint extraction
assistant.

Extract information from the complaint below.

Return ONLY valid JSON.

Use exactly these fields:

{{
    "source": null,
    "customer_name": null,
    "organization": null,
    "product_name": null,
    "material_type": null,
    "dosage_form": null,
    "strength": null,
    "batch_number": null,
    "category": null,
    "description": null,
    "manufacture_date": null,
    "expiration_date": null
}}

Rules:

1. Never invent information.
2. If information is not present, use null.
3. Use "API" or "FDF" for material_type when possible.
4. Keep the description concise.
5. Return ONLY JSON.
6. "source" must be exactly one of: "Email", "Phone", "Web",
   "Distributor", "Sales Representative" — identify this
   regardless of where it appears in the complaint text.
7. "category" must be exactly one of: "Packaging", "Labeling",
   "Product Quality", "Contamination", "Foreign Matter",
   "Appearance", "Dosage", "Quantity", "Wrong Product",
   "Documentation", "Other" — identify this regardless of
   where it appears in the complaint text.

Complaint:

{complaint_text}
"""

    response = client.chat.completions.create(
        model=GROQ_MODEL,

        messages=[
            {
                "role": "system",
                "content": (
                    "You extract structured information "
                    "from pharmaceutical complaints."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],

        temperature=0
    )

    content = response.choices[0].message.content

    try:

        extracted = json.loads(content)

    except json.JSONDecodeError:

        extracted = {
            "source": None,
            "category": None,
            "customer_name": None,
            "organization": None,
            "product_name": None,
            "material_type": None,
            "dosage_form": None,
            "strength": None,
            "batch_number": None,
            "category": None,
            "description": None,
            "manufactureDate": None,
            "expirationDate": None
        }

    return {
        "extracted_fields": extracted
    }
def check_completeness(state):

    fields = state["extracted_fields"]

    required_fields = [
        "customer_name",
        "product_name",
        "batch_number",
        "category",
        "description",
        "manufactureDate",
        "expirationDate"
    ]

    missing = []

    for field in required_fields:

        value = fields.get(field)

        if value is None or str(value).strip() == "":
            missing.append(field)

    total = len(required_fields)

    completed = total - len(missing)

    score = round((completed / total) * 100)

    return {
        "missing_fields": missing,
        "completeness_score": score
    }

def assess_risk(state):

    fields = state["extracted_fields"]

    category = fields.get("category")
    description = fields.get("description")
    expiration_date = fields.get("expirationDate")

    prompt = f"""
You are a pharmaceutical Quality Risk Management assistant.

Assess the potential risk of this customer complaint.

Complaint category:
{category}

Description:
{description}

Expiration date:
{expiration_date}

Return ONLY JSON:

{{
    "risk_level": "LOW",
    "risk_score": 1,
    "risk_reason": ""
}}

Risk levels:

LOW = unlikely to affect product quality or patient safety.

MEDIUM = possible quality impact requiring investigation.

HIGH = significant potential impact on product quality or patient safety.

CRITICAL = immediate or severe potential patient safety risk.

Risk score must be between 1 and 100.

Do not invent facts.
Base the assessment only on the information provided.
"""

    response = client.chat.completions.create(
        model=GROQ_MODEL,

        messages=[
            {
                "role": "system",
                "content": (
                    "You are a pharmaceutical quality "
                    "risk assessment assistant."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],

        temperature=0
    )

    content = response.choices[0].message.content

    try:

        result = json.loads(content)

    except json.JSONDecodeError:

        result = {
            "risk_level": "MEDIUM",
            "risk_score": 50,
            "risk_reason": (
                "Unable to automatically determine "
                "risk with sufficient confidence."
            )
        }

    return {
        "risk_level": result.get(
            "risk_level",
            "MEDIUM"
        ),

        "risk_score": result.get(
            "risk_score",
            50
        ),

        "risk_reason": result.get(
            "risk_reason",
            ""
        )
    }

def generate_summary(state):

    fields = state["extracted_fields"]

    prompt = f"""
Create a concise professional summary of this
pharmaceutical customer complaint.

Complaint information:

{json.dumps(fields, indent=2)}

Write 2-3 sentences.

Do not invent information.
"""

    response = client.chat.completions.create(
        model=GROQ_MODEL,

        messages=[
            {
                "role": "system",
                "content": (
                    "You summarize pharmaceutical "
                    "quality complaints."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],

        temperature=0.2
    )

    summary = response.choices[0].message.content

    return {
        "summary": summary
    }

def analyze_root_cause(state: ComplaintState):

    extracted = state.get("extracted_fields", {})

    category = extracted.get("category")
    description = extracted.get("description")
    expiration_date = extracted.get("expirationDate")

    prompt = f"""
You are a pharmaceutical Quality Assurance expert.

Analyze the following customer complaint and suggest possible root causes.

Complaint category:
{category}

Complaint description:
{description}

Important rules:
- Do not invent facts.
- These are only preliminary hypotheses.
- Keep suggestions practical and relevant to pharmaceutical manufacturing.
- Return exactly 3 possible root cause suggestions.
- Return ONLY valid JSON.

Format:

{{
    "root_causes": [
        "Root cause suggestion 1",
        "Root cause suggestion 2",
        "Root cause suggestion 3"
    ]
}}
"""

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    content = response.choices[0].message.content.strip()

    try:
        data = json.loads(content)

        root_causes = data.get("root_causes", [])

    except Exception:
        root_causes = []

    return {
        "root_cause_suggestions": root_causes
    }

def recommend_capa(state: ComplaintState):

    extracted = state.get("extracted_fields", {})

    category = extracted.get("category")
    description = extracted.get("description")

    risk_level = state.get("risk_level", "UNKNOWN")

    prompt = f"""
You are a pharmaceutical Quality Assurance expert.

Based on the complaint below, recommend preliminary CAPA actions.

Complaint category:
{category}

Complaint description:
{description}

Risk level:
{risk_level}

Provide practical recommendations for:

- Corrective Action
- Preventive Action
- Investigation / verification

Important rules:
- Do not invent facts.
- Recommendations must be preliminary.
- Final CAPA decisions must be made by qualified QA personnel.
- Return exactly 4 recommendations.
- Return ONLY valid JSON.

Format:

{{
    "capa": [
        "Recommendation 1",
        "Recommendation 2",
        "Recommendation 3",
        "Recommendation 4"
    ]
}}
"""

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    content = response.choices[0].message.content.strip()

    try:
        data = json.loads(content)

        capa = data.get("capa", [])

    except Exception:
        capa = []

    return {
        "capa_recommendations": capa
    }