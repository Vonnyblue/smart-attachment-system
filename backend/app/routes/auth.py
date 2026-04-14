from fastapi import APIRouter, Depends, Form, HTTPException
from sqlalchemy.orm import Session

from app.core.jwt_handler import create_access_token
from app.core.security import hash_password, verify_password
from app.database import SessionLocal
from app.models.user import User

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    notification_frequency: str = Form("daily"),
    role: str = Form("student"),
    company_name: str = Form(None),
    field: str = Form(None),
    skills: str = Form(None),
    preferred_location: str = Form(None),
    bio: str = Form(None),
    db: Session = Depends(get_db),
):
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    normalized_role = (role or "student").lower()
    if normalized_role not in {"student", "admin"}:
        raise HTTPException(status_code=400, detail="Unsupported role")

    new_user = User(
        name=name,
        email=email,
        password=hash_password(password),
        notification_frequency=notification_frequency,
        role=normalized_role,
        company_name=company_name,
        field=field,
        skills=skills,
        preferred_location=preferred_location,
        bio=bio,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.email})

    return {
        "message": "User created successfully",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "notification_frequency": new_user.notification_frequency,
            "role": new_user.role,
            "company_name": new_user.company_name,
            "field": new_user.field,
            "skills": new_user.skills,
            "preferred_location": new_user.preferred_location,
            "bio": new_user.bio,
        },
    }


@router.post("/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "notification_frequency": user.notification_frequency,
            "role": user.role or "student",
            "company_name": user.company_name,
            "field": user.field,
            "skills": user.skills,
            "preferred_location": user.preferred_location,
            "bio": user.bio,
        },
    }
