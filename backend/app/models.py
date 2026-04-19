from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), default="student")  # student | hr | admin

    # Student fields
    field = Column(String(255))
    skills = Column(Text)
    preferred_location = Column(String(255))
    bio = Column(Text)
    notification_frequency = Column(String(50), default="weekly")

    # HR fields
    company_name = Column(String(255))
    company_description = Column(Text)

    jobs = relationship("Job", back_populates="posted_by")
    applications = relationship("Application", back_populates="student")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(255))
    description = Column(Text)
    skills_required = Column(Text)  # comma-separated
    is_remote = Column(Boolean, default=False)
    apply_link = Column(String(500))
    posted_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    hr_id = Column(Integer, ForeignKey("users.id"))
    posted_by = relationship("User", back_populates="jobs")
    applications = relationship("Application", back_populates="job")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String(50), default="pending")  # pending | accepted | rejected
    applied_at = Column(DateTime, default=datetime.utcnow)
    cover_note = Column(Text)

    student_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))

    student = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")