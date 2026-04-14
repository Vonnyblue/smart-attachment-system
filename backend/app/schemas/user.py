from typing import Optional

from pydantic import BaseModel


class UpdateProfile(BaseModel):
    name: Optional[str] = None
    company_name: Optional[str] = None
    field: Optional[str] = None
    skills: Optional[str] = None
    preferred_location: Optional[str] = None
    notification_frequency: Optional[str] = None
    bio: Optional[str] = None


class UpdateNotification(BaseModel):
    notification_frequency: str


class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    notification_frequency: str
    role: str
    company_name: Optional[str] = None
    field: Optional[str] = None
    skills: Optional[str] = None
    preferred_location: Optional[str] = None
    bio: Optional[str] = None
