from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class ApplicationCreate(BaseModel):
    job_id: int
    cover_note: Optional[str] = None


class ApplicationResponse(BaseModel):
    id: int
    status: str
    applied_at: datetime
    cover_note: Optional[str] = None
    student_id: int
    job_id: int

    class Config:
        from_attributes = True


class ApplicationWithJob(ApplicationResponse):
    job_title: str
    company: str
    location: Optional[str] = None


class ApplicationWithStudent(ApplicationResponse):
    student_name: str
    student_email: str
    student_skills: Optional[str] = None
    job_title: str