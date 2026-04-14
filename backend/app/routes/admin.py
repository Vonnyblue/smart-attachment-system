from sqlalchemy import desc
from sqlalchemy.orm import Session

from fastapi import APIRouter, Depends, HTTPException

from app.core.dependencies import get_current_user, get_db
from app.models.application import Application
from app.models.internship import Internship
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["admin"])


def _require_admin(current_user: User) -> None:
    if (current_user.role or "student") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")


@router.get("/overview")
def get_admin_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)

    users = db.query(User).order_by(desc(User.id)).all()
    jobs = db.query(Internship).order_by(desc(Internship.created_at)).all()
    applications = db.query(Application).order_by(desc(Application.created_at)).all()

    student_count = len([user for user in users if (user.role or "student") == "student"])
    admin_count = len([user for user in users if (user.role or "student") == "admin"])

    return {
        "metrics": {
            "total_users": len(users),
            "students": student_count,
            "admins": admin_count,
            "total_jobs": len(jobs),
            "active_jobs": len([job for job in jobs if job.status == "active"]),
            "applications": len(applications),
        },
        "recent_users": [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role or "student",
                "company_name": user.company_name,
            }
            for user in users[:8]
        ],
        "recent_jobs": [
            {
                "id": job.id,
                "title": job.title,
                "company_name": job.company_name,
                "status": job.status,
                "location": job.location,
                "created_at": job.created_at.isoformat() if job.created_at else None,
            }
            for job in jobs[:8]
        ],
        "recent_applications": [
            {
                "id": application.id,
                "internship_id": application.internship_id,
                "student_id": application.student_id,
                "status": application.status,
                "created_at": application.created_at.isoformat() if application.created_at else None,
            }
            for application in applications[:8]
        ],
    }


@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)

    users = db.query(User).order_by(desc(User.id)).all()
    return {
        "users": [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role or "student",
                "company_name": user.company_name,
                "field": user.field,
                "skills": user.skills,
                "preferred_location": user.preferred_location,
                "notification_frequency": user.notification_frequency,
            }
            for user in users
        ]
    }


@router.get("/jobs")
def get_all_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)

    jobs = db.query(Internship).order_by(desc(Internship.created_at)).all()
    return {
        "jobs": [
            {
                "id": job.id,
                "title": job.title,
                "company_name": job.company_name,
                "location": job.location,
                "work_type": job.work_type,
                "status": job.status,
                "skills_required": job.skills_required,
                "salary": job.salary,
                "created_at": job.created_at.isoformat() if job.created_at else None,
            }
            for job in jobs
        ]
    }


@router.get("/applications")
def get_all_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)

    applications = db.query(Application).order_by(desc(Application.created_at)).all()
    return {
        "applications": [
            {
                "id": application.id,
                "internship_id": application.internship_id,
                "student_id": application.student_id,
                "status": application.status,
                "cover_note": application.cover_note,
                "created_at": application.created_at.isoformat() if application.created_at else None,
            }
            for application in applications
        ]
    }
