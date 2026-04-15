from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import desc, or_
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.application import Application
from app.models.internship import Internship
from app.models.user import User
from app.schemas.internship_schema import (
    InternshipCreate,
    InternshipUpdate,
    JobApplicationCreate,
)
from app.services.jsearch_service import fetch_internships

router = APIRouter(prefix="/internships", tags=["internships"])


def _require_role(current_user: User, allowed_roles: set[str]) -> None:
    if (current_user.role or "student") not in allowed_roles:
        raise HTTPException(status_code=403, detail="You are not allowed to perform this action")


def _parse_skills(value: str | None) -> list[str]:
    if not value:
        return []
    return [item.strip().lower() for item in value.split(",") if item.strip()]


def _serialize_job(job: Internship, *, match_score: int | None = None, application_count: int | None = None):
    return {
        "id": job.id,
        "job_id": f"local-{job.id}",
        "title": job.title,
        "job_title": job.title,
        "company": job.company_name,
        "company_name": job.company_name,
        "employer_name": job.company_name,
        "location": job.location,
        "job_location": job.location,
        "salary": job.salary,
        "work_type": job.work_type,
        "job_type": job.work_type,
        "category": job.category,
        "job_category": job.category,
        "description": job.description,
        "skills_required": job.skills_required,
        "application_deadline": job.application_deadline,
        "status": job.status,
        "is_external": job.is_external,
        "created_at": job.created_at.isoformat() if job.created_at else None,
        "match_score": match_score,
        "application_count": application_count,
    }


def _serialize_application(application: Application, job: Internship, student: User):
    student_skills = _parse_skills(student.skills)
    job_skills = _parse_skills(job.skills_required)
    matched_skills = len(set(student_skills).intersection(job_skills))
    match_score = 60 + min(matched_skills * 10, 35)

    return {
        "id": application.id,
        "status": application.status,
        "cover_note": application.cover_note,
        "created_at": application.created_at.isoformat() if application.created_at else None,
        "job": _serialize_job(job),
        "student": {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "field": student.field,
            "skills": student.skills,
            "preferred_location": student.preferred_location,
            "bio": student.bio,
        },
        "match_score": match_score,
    }


def _local_job_matches(
    db: Session,
    *,
    query: str | None = None,
    location: str | None = None,
    include_inactive: bool = False,
):
    jobs_query = db.query(Internship)

    if not include_inactive:
        jobs_query = jobs_query.filter(Internship.status == "active")

    if query:
        like_query = f"%{query.lower()}%"
        jobs_query = jobs_query.filter(
            or_(
                Internship.title.ilike(like_query),
                Internship.description.ilike(like_query),
                Internship.company_name.ilike(like_query),
                Internship.skills_required.ilike(like_query),
                Internship.category.ilike(like_query),
            )
        )

    if location:
        jobs_query = jobs_query.filter(Internship.location.ilike(f"%{location.lower()}%"))

    return jobs_query.order_by(desc(Internship.created_at)).all()


@router.get("/search")
async def search_internships(
    query: str = Query("", description="Field of study, skill, or job title"),
    location: str = Query(None, description="Preferred location"),
    page: int = Query(1, ge=1),
    db: Session = Depends(get_db),
):
    external_query = query.strip() or "software engineering"
    try:
        external_data = await fetch_internships(
            query=external_query,
            location=location,
            page=page,
        )
        external_results = external_data.get("results", [])
    except Exception:
        external_results = []

    return {
        "count": len(external_results),
        "page": page,
        "results": external_results,
    }


@router.get("/match")
async def match_internships(
    field: str = Query(""),
    skills: str = Query(None, description="Comma-separated skills"),
    location: str = Query(None),
    page: int = Query(1, ge=1),
    db: Session = Depends(get_db),
):
    query_parts = [part for part in [field, skills] if part]
    query = " ".join(query_parts).strip()

    external_results = []
    try:
        external_data = await fetch_internships(
            query=query or field or "internship",
            location=location,
            page=page,
        )
        external_results = external_data.get("results", [])
    except Exception:
        external_results = []

    return {
        "count": len(external_results),
        "page": page,
        "results": external_results,
    }


@router.post("/company/jobs")
def create_job(
    data: InternshipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_role(current_user, {"company", "admin"})

    company_name = current_user.company_name or current_user.name
    job = Internship(
        title=data.title,
        company_name=company_name,
        location=data.location,
        work_type=data.work_type,
        category=data.category,
        salary=data.salary,
        description=data.description,
        skills_required=data.skills_required,
        application_deadline=data.application_deadline,
        posted_by_user_id=current_user.id,
        status="active",
        is_external=False,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return {"message": "Job posted successfully", "job": _serialize_job(job)}


@router.get("/company/jobs")
def get_company_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_role(current_user, {"company", "admin"})

    jobs = (
        db.query(Internship)
        .filter(Internship.posted_by_user_id == current_user.id)
        .order_by(desc(Internship.created_at))
        .all()
    )

    job_ids = [job.id for job in jobs]
    application_counts = {}
    if job_ids:
        applications = db.query(Application).filter(Application.internship_id.in_(job_ids)).all()
        for application in applications:
            application_counts[application.internship_id] = application_counts.get(application.internship_id, 0) + 1

    return {
        "jobs": [
            _serialize_job(job, application_count=application_counts.get(job.id, 0))
            for job in jobs
        ]
    }


@router.put("/company/jobs/{job_id}")
def update_job(
    job_id: int,
    data: InternshipUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_role(current_user, {"company", "admin"})

    job = db.query(Internship).filter(Internship.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if (current_user.role or "student") != "admin" and job.posted_by_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this job")

    for field_name, value in data.model_dump(exclude_unset=True).items():
        setattr(job, field_name, value)

    db.commit()
    db.refresh(job)
    return {"message": "Job updated", "job": _serialize_job(job)}


@router.get("/company/candidates")
def get_company_candidates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_role(current_user, {"company", "admin"})

    jobs = db.query(Internship).filter(Internship.posted_by_user_id == current_user.id).all()
    job_by_id = {job.id: job for job in jobs}
    if not job_by_id:
        return {"candidates": []}

    applications = (
        db.query(Application, User)
        .join(User, User.id == Application.student_id)
        .filter(Application.internship_id.in_(list(job_by_id.keys())))
        .order_by(desc(Application.created_at))
        .all()
    )

    return {
        "candidates": [
            _serialize_application(application, job_by_id[application.internship_id], student)
            for application, student in applications
        ]
    }


@router.post("/jobs/{job_id}/apply")
def apply_to_job(
    job_id: int,
    data: JobApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_role(current_user, {"student", "admin"})

    job = db.query(Internship).filter(Internship.id == job_id, Internship.status == "active").first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing_application = (
        db.query(Application)
        .filter(Application.internship_id == job_id, Application.student_id == current_user.id)
        .first()
    )
    if existing_application:
        raise HTTPException(status_code=400, detail="You have already applied for this job")

    application = Application(
        internship_id=job_id,
        student_id=current_user.id,
        cover_note=data.cover_note,
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    return {"message": "Application submitted successfully"}


@router.get("/student/applications")
def get_student_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_role(current_user, {"student", "admin"})

    applications = (
        db.query(Application, Internship)
        .join(Internship, Internship.id == Application.internship_id)
        .filter(Application.student_id == current_user.id)
        .order_by(desc(Application.created_at))
        .all()
    )

    return {
        "applications": [
            {
                "id": application.id,
                "status": application.status,
                "cover_note": application.cover_note,
                "created_at": application.created_at.isoformat() if application.created_at else None,
                "job": _serialize_job(job),
            }
            for application, job in applications
        ]
    }
