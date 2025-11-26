from typing import Optional
from sqlmodel import Field, SQLModel

#el paciente no tien user id, no inicia sesion , es solo un registro medico

# 1. LA BASE: Datos comunes del paciente
class PatientBase(SQLModel):
    nombre: str
    telefono: str
    email: str


class PatientCreate(PatientBase):#ESQUEMA CREAR: Lo que recibimos del formulario
    pass


class PatientRead(PatientBase):#ESQUEMA LEER: Lo que entregamos al consultar
    id_patient: int


class patients(PatientBase, table=True):#LA TABLA: La estructura real en disco
    id_patient: int | None = Field(default=None, primary_key=True)