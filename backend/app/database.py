from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def _ensure_columns(table_name: str, column_definitions: dict[str, str]) -> None:
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    if table_name not in existing_tables:
        return

    existing_columns = {column["name"] for column in inspector.get_columns(table_name)}
    missing_columns = {
        column_name: definition
        for column_name, definition in column_definitions.items()
        if column_name not in existing_columns
    }

    if not missing_columns:
        return

    with engine.begin() as connection:
        for column_name, definition in missing_columns.items():
            connection.execute(
                text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {definition}")
            )


def _seed_admin() -> None:
    from app.models.user import User
    from app.core.security import hash_password

    admin_email = os.getenv("ADMIN_EMAIL", "admin@platform.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "changeme123")

    db = SessionLocal()
    try:
        exists = db.query(User).filter(User.email == admin_email).first()
        if not exists:
            db.add(User(
                name="Admin",
                email=admin_email,
                password=hash_password(admin_password),
                role="admin",
                notification_frequency="daily",
            ))
            db.commit()
            print(f"[bootstrap] Admin seeded: {admin_email}")
        else:
            print(f"[bootstrap] Admin already exists: {admin_email}")
    finally:
        db.close()


def bootstrap_database() -> None:
    Base.metadata.create_all(bind=engine)
    _ensure_columns(
        "users",
        {
            "role": "VARCHAR(50) DEFAULT 'student'",
            "company_name": "VARCHAR(255)",
            "company_description": "TEXT",
            "bio": "TEXT",
        },
    )
    _seed_admin()