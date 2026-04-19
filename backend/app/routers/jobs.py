from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.user import User
from ..models.job import Job
from ..schemas.job import JobCreate, JobUpdate, JobResponse
from ..core.dependencies import get_current_user  # your existing auth dep

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("/", response_model=JobResponse)
def create_job(body: JobCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    if current_user.role != "hr":
        raise HTTPException(status_code=403, detail="Only HR accounts can post jobs.")

    if not current_user.company_name:
        raise HTTPException(status_code=400, detail="HR account missing company name.")
    
    normalized_skills = ", ".join(
        s.strip().lower() for s in (body.skills_required or "").split(",") if s.strip()
    )

    job = Job(
        title=body.title,
        company=current_user.company_name or current_user.name,
        location=body.location,
        description=body.description,
        skills_required=normalized_skills,
        is_remote=body.is_remote,
        apply_link=body.apply_link,
        hr_id=current_user.id,
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return job


@router.get("/my", response_model=List[JobResponse])
def my_jobs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "hr":
        raise HTTPException(status_code=403, detail="Only HR accounts can access this.")
    return db.query(Job).filter(Job.hr_id == current_user.id).all()


@router.patch("/{job_id}", response_model=JobResponse)
def update_job(job_id: int, body: JobUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id, Job.hr_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(job, field, value)
    db.commit()
    db.refresh(job)
    return job


@router.delete("/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id, Job.hr_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    db.delete(job)
    db.commit()
    return {"detail": "Deleted."}


@router.get("/skills")
def list_skills(db: Session = Depends(get_db)):
    """Returns all unique skills across active platform jobs."""
    jobs = db.query(Job.skills_required).filter(Job.is_active == True, Job.skills_required != None).all()
    skill_set = set()
    for (skills_str,) in jobs:
        for s in skills_str.split(","):
            s = s.strip().lower()
            if s:
                skill_set.add(s)
    return sorted(skill_set)

@router.get("/match")
def match_jobs_for_student(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Returns platform jobs that match this student's skills/field."""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Students only.")

    student_skills = set(s.strip().lower() for s in (current_user.skills or "").split(",") if s.strip())
    student_field = (current_user.field or "").lower()

    jobs = db.query(Job).filter(Job.is_active == True).all()
    scored = []
    for job in jobs:
        job_skills = set(s.strip().lower() for s in (job.skills_required or "").split(",") if s.strip())
        overlap = len(student_skills & job_skills)
        field_match = student_field and student_field in (job.title or "").lower()
        score = overlap + (2 if field_match else 0)
        if score > 0 or not student_skills:
            scored.append((score, job))

    scored.sort(key=lambda x: x[0], reverse=True)
    return {
        "results": [
            {
                "job_id": j.id,
                "title": j.title,
                "company": j.company,
                "location": j.location,
                "skills_required": j.skills_required,
                "apply_link": None,  # apply via platform
                "is_platform_job": True,
                "posted_at": j.posted_at,
            }
            for _, j in scored[:10]
        ]
    }