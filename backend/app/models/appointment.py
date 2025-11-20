from typing import Optional
from datetime import datetime
from sqlmodel import Field, SQLModel

#Modelo para CITAS
class appointments (SQLModel, table=True):
    id_appoimtment : int | None = Field(default=None, primary_key=True)
    doctor_id : int = Field(foreign_key="doctors.id_doctor")
    patient_id : int = Field(foreign_key="patients.id_patient")
    fecha : datetime
    status : str = Field(default="Agendada")
