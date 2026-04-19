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


def _user_response(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "notification_frequency": user.notification_frequency,
        "role": user.role,
        "company_name": user.company_name,
        "company_description": getattr(user, "company_description", None),
        "field": user.field,
        "skills": user.skills,
        "preferred_location": user.preferred_location,
        "bio": user.bio,
    }


@router.post("/register")
def register(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    notification_frequency: str = Form("daily"),
    role: str = Form("student"),
    company_name: str = Form(None),
    company_description: str = Form(None),
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

    # Admin cannot be created via registration — it is seeded only
    if normalized_role not in {"student", "hr"}:
        raise HTTPException(status_code=403, detail="Cannot register with that role.")
    
    if skills:
        skills = ", ".join(s.strip().lower() for s in skills.split(",") if s.strip())

    new_user = User(
        name=name,
        email=email,
        password=hash_password(password),
        notification_frequency=notification_frequency,
        role=normalized_role,
        company_name=company_name if normalized_role == "hr" else None,
        company_description=company_description if normalized_role == "hr" else None,
        field=field if normalized_role == "student" else None,
        skills=skills if normalized_role == "student" else None,
        preferred_location=preferred_location if normalized_role == "student" else None,
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
        "user": _user_response(new_user),
    }


@router.post("/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": _user_response(user),
    }