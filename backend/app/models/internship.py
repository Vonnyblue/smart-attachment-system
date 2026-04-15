from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text

from app.database import Base


class Internship(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    work_type = Column(String, nullable=True)
    category = Column(String, nullable=True)
    salary = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    skills_required = Column(String, nullable=True)
    application_deadline = Column(String, nullable=True)
    status = Column(String, default="active", nullable=False)
    is_external = Column(Boolean, default=False, nullable=False)
    posted_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
