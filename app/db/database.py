from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Bu dosya projenin olduğu yerde 'sql_app.db' diye bir dosya oluşturacak.
# Bu senin veritabanın. Kuruluma gerek yok.
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

# check_same_thread=False sadece SQLite için gereklidir
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency (Her istekte veritabanı oturumu açıp kapatan yardımcı)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()