from typing import Optional
from datetime import datetime
from sqlmodel import Field, SQLModel


class AppointmentBase(SQLModel): # Datos comunes (Doctor, Paciente, Fecha, Estado)
    doctor_id: int = Field(foreign_key="doctors.id_doctor")
    patient_id: int = Field(foreign_key="patients.id_patient")
    fecha: datetime
    status: str = Field(default="Agendada")


class AppointmentCreate(AppointmentBase): #CREAR: Lo que envía el usuario
    pass


class AppointmentRead(AppointmentBase):#LEER: Lo que devuelve el sistema (incluye el ID de la cita)
    id_appointment: int


class appointments(AppointmentBase, table=True):# TABLA: La configuración de base de datos
    id_appointment: int | None = Field(default=None, primary_key=True)