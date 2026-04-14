from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv();

DATABASE_URL=os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()


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


def bootstrap_database() -> None:
    Base.metadata.create_all(bind=engine)
    _ensure_columns(
        "users",
        {
            "role": "VARCHAR(50) DEFAULT 'student'",
            "company_name": "VARCHAR(255)",
            "bio": "TEXT",
        },
    )
