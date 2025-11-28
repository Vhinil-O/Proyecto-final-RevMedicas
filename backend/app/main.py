from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.database import create_db_and_tables

from app.routes import doctors as doctor_router
from app.routes import patients as patient_router
from app.routes import appointments as appointment_router
from app.routes import users as user_router
from app.routes import auth as auth_router

from app.models.appointment import appointments
from app.models.doctor import doctors
from app.models.patient import patients
from app.models.user import users


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

# Configuración de CORS (Igual que antes)
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "El sistema del hospital está funcionando"}

app.include_router(doctor_router.router, prefix="/doctors", tags=["Doctores"]) # Esto conecta el archivo de doctores con la URL "/doctors"
app.include_router(patient_router.router, prefix="/patients", tags=["Pacientes"])
app.include_router(appointment_router.router, prefix="/appointments", tags=["Citas"])
app.include_router(user_router.router, prefix="/users", tags=["Usuarios"])
app.include_router(auth_router.router, tags=["Autenticación"])