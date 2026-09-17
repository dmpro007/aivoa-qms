from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.ai.graph import complaint_graph
from app.database.database import Base, engine
from app.database import models
from app.api.complaints import router as complaints_router


app = FastAPI(
    title="AIVOA QMS API",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

# Allow React frontend to communicate with FastAPI

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
         "https://aivoa-qms.vercel.app"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


class ComplaintRequest(BaseModel):

    complaint_text: str


@app.get("/api/health")
def health_check():

    return {
        "status": "ok",
        "service": "AIVOA QMS API"
    }


@app.post("/api/complaints/analyze")
def analyze_complaint(
    request: ComplaintRequest
):

    initial_state = {
        "raw_text": request.complaint_text
    }

    result = complaint_graph.invoke(
        initial_state
    )

    return {
        "success": True,
        "data": result
    }

app.include_router(complaints_router)