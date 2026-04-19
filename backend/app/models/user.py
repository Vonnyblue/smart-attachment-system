from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    notification_frequency = Column(String, default="daily")
    role = Column(String, default="student")
    company_name = Column(String, nullable=True)
    company_description = Column(String, nullable=True)
    field = Column(String, nullable=True)
    skills = Column(String, nullable=True)
    preferred_location = Column(String, nullable=True)
    bio = Column(String, nullable=True)

    jobs = relationship("Job", back_populates="posted_by")
    applications = relationship("Application", back_populates="student")