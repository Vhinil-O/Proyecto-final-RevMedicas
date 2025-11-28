# backend/app/config/settings.py
import os
from dotenv import load_dotenv

# Cargar el archivo .env
load_dotenv()

# Leer las variables (si no existen, usa los valores por defecto de la derecha)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///hospital.db")
SECRET_KEY = os.getenv("SECRET_KEY", "secreto_default_inseguro")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))