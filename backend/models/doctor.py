from typing import Optional
from sqlmodel import Field, SQLModel

#Modelo para el DOCTOR
class doctors(SQLModel, table=True) :
    id_doctor: int | None = Field(default=None, primary_key=True)
    nombre: str
    especialidad: str

    user_id: int = Field(default=None, foreign_key="user.id")


