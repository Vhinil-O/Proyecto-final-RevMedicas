from typing import Optional
from sqlmodel import Field, SQLModel

#Modelo para PACIENTE
class patients(SQLModel, table=True) :
    id_patient : int | None = Field(default=None, primary_key=True)
    nombre : str
    telefono : str
    email : str