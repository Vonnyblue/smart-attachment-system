from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(255))
    description = Column(Text)
    skills_required = Column(Text)
    is_remote = Column(Boolean, default=False)
    apply_link = Column(String(500))
    posted_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    hr_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    posted_by = relationship("User", back_populates="jobs")
    applications = relationship("Application", back_populates="job")