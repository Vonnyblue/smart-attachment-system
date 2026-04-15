import httpx
import os
from typing import Optional

RAPIDAPI_KEY = os.getenv("JSEARCH_API_KEY")
RAPIDAPI_HOST = os.getenv("JSEARCH_API_HOST", "jsearch.p.rapidapi.com")

BASE_URL = "https://jsearch.p.rapidapi.com/search"

HEADERS = {
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": RAPIDAPI_HOST,
}


async def fetch_internships(
    query: str,
    location: Optional[str] = None,
    page: int = 1,
    num_pages: int = 1,
) -> dict:
    """
    Fetch internship listings from JSearch API.
    query: e.g. "software engineering internship"
    location: e.g. "Nairobi, Kenya"
    """
    # Always append 'internship' to bias results
    search_query = f"{query} internship"
    if location:
        search_query += f" in {location}"

    params = {
        "query": search_query,
        "page": str(page),
        "num_pages": str(num_pages),
        "employment_types": "INTERN",   # filter to internships only
        "date_posted": "month",         # listings from last 30 days
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        #response = client.get(BASE_URL, headers=HEADERS, params=params)  # ← see note
        response = await client.get(BASE_URL, headers=HEADERS, params=params)
        response.raise_for_status()
        data = response.json()

    jobs = data.get("data", [])

    
    results = []
    for job in jobs:
        results.append({
            "job_id": job.get("job_id"),
            "title": job.get("job_title"),
            "company": job.get("employer_name"),
            "location": job.get("job_city") or job.get("job_country"),
            "description": job.get("job_description", "")[:300] + "...",
            "date_posted": job.get("job_posted_at_datetime_utc"),
            "apply_link": job.get("job_apply_link"),
            "employment_type": job.get("job_employment_type"),
            "is_remote": job.get("job_is_remote", False),
            "logo": job.get("employer_logo"),
        })

    return {
        "count": len(results),
        "page": page,
        "results": results,
    }