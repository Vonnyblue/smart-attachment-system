from sqlalchemy import Column, Integer, String
from app.database import Base

class User(Base):
    __tablename__= "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    notification_frequency = Column(String)
    role = Column(String, default="student")
    company_name = Column(String, nullable=True)
    field = Column(String, nullable=True)
    skills = Column(String, nullable=True)
    preferred_location = Column(String, nullable=True)
    bio = Column(String, nullable=True)
