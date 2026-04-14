from typing import Optional

from pydantic import BaseModel


class InternshipCreate(BaseModel):
    title: str
    location: Optional[str] = None
    work_type: Optional[str] = None
    category: Optional[str] = None
    salary: Optional[str] = None
    description: str
    skills_required: Optional[str] = None
    application_deadline: Optional[str] = None


class InternshipUpdate(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    work_type: Optional[str] = None
    category: Optional[str] = None
    salary: Optional[str] = None
    description: Optional[str] = None
    skills_required: Optional[str] = None
    application_deadline: Optional[str] = None
    status: Optional[str] = None


class JobApplicationCreate(BaseModel):
    cover_note: Optional[str] = None
