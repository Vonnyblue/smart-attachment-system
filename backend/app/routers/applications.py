from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.job import Job
from ..models.user import User
from ..models.application import Application
from ..schemas.application import ApplicationCreate, ApplicationResponse, ApplicationWithJob, ApplicationWithStudent
from ..core.dependencies import get_current_user

router = APIRouter(prefix="/applications", tags=["applications"])


@router.post("/", response_model=ApplicationResponse)
def apply(
    body: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can apply.")
    job = db.query(Job).filter(Job.id == body.job_id, Job.is_active == True).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    existing = db.query(Application).filter(
        Application.student_id == current_user.id,
        Application.job_id == body.job_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied.")
    app = Application(
        student_id=current_user.id,
        job_id=body.job_id,
        cover_note=body.cover_note,
        status="pending",
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


@router.get("/my", response_model=List[ApplicationWithJob])
def my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Students only.")
    apps = db.query(Application).filter(Application.student_id == current_user.id).all()
    return [
        {
            **a.__dict__,
            "job_title": a.job.title,
            "company": a.job.company,
            "location": a.job.location,
        }
        for a in apps
    ]


@router.get("/for-hr", response_model=List[ApplicationWithStudent])
def applications_for_hr(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "hr":
        raise HTTPException(status_code=403, detail="HR only.")
    apps = (
        db.query(Application)
        .join(Job, Job.id == Application.job_id)
        .filter(Job.hr_id == current_user.id)
        .all()
    )
    return [
        {
            **a.__dict__,
            "student_name": a.student.name,
            "student_email": a.student.email,
            "student_skills": a.student.skills,
            "job_title": a.job.title,
        }
        for a in apps
    ]


@router.patch("/{application_id}/status")
def update_status(
    application_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "hr":
        raise HTTPException(status_code=403, detail="HR only.")
    if status not in ("accepted", "rejected"):
        raise HTTPException(status_code=400, detail="Status must be accepted or rejected.")
    app = (
        db.query(Application)
        .join(Job, Job.id == Application.job_id)
        .filter(Application.id == application_id, Job.hr_id == current_user.id)
        .first()
    )
    if not app:
        raise HTTPException(status_code=404, detail="Application not found.")
    app.status = status
    db.commit()
    return {"detail": f"Application {status}."}