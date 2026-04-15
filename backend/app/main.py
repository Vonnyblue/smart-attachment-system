from fastapi import FastAPI
from app.database import bootstrap_database
from app.models import application, internship, user
from app.routes import admin, auth, internships
from app.routes import user as user_routes
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # react server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(user_routes.router, prefix="/user", tags=["User"])
app.include_router(internships.router)
app.include_router(admin.router)

bootstrap_database()
