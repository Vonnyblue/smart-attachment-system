from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.user import UpdateNotification, UpdateProfile

router = APIRouter()


def _serialize_user(current_user: User):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "notification_frequency": current_user.notification_frequency,
        "role": current_user.role or "student",
        "company_name": current_user.company_name,
        "field": current_user.field,
        "skills": current_user.skills,
        "preferred_location": current_user.preferred_location,
        "bio": current_user.bio,
    }


@router.get("/me")
def get_profile(current_user: User = Depends(get_current_user)):
    return _serialize_user(current_user)

@router.put("/update-profile")
def update_profile(
    data: UpdateProfile,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    update_data = data.model_dump(exclude_unset=True)

    # Normalize skills to lowercase
    if "skills" in update_data and update_data["skills"]:
        update_data["skills"] = ", ".join(
            s.strip().lower() for s in update_data["skills"].split(",") if s.strip()
        )

    for field_name, value in update_data.items():
        setattr(current_user, field_name, value)

    db.commit()
    db.refresh(current_user)
    return {
        "message": "Profile updated",
        "user": _serialize_user(current_user),
    }



@router.put("/update-notification")
def update_notification(
    data: UpdateNotification,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.notification_frequency = data.notification_frequency
    db.commit()
    db.refresh(current_user)

    return {
        "message": "Notification settings updated",
        "user": _serialize_user(current_user),
    }
