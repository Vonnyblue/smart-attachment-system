from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class JobCreate(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    description: Optional[str] = None
    skills_required: Optional[str] = None
    is_remote: bool = False
    apply_link: Optional[str] = None


class JobUpdate(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    skills_required: Optional[str] = None
    is_remote: Optional[bool] = None
    apply_link: Optional[str] = None
    is_active: Optional[bool] = None


class JobResponse(BaseModel):
    id: int
    title: str
    company: str
    location: Optional[str] = None
    description: Optional[str] = None
    skills_required: Optional[str] = None
    is_remote: bool
    apply_link: Optional[str] = None
    posted_at: datetime
    is_active: bool
    hr_id: int

    class Config:
        from_attributes = True