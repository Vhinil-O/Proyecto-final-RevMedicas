from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from datetime import date, datetime

from app.config.database import get_session
from app.models.appointment import AppointmentCreate, AppointmentRead, appointments

from app.models.user import users # Para saber qué tipo de dato devuelve el guardia
from app.middleware.auth import get_current_user 


router = APIRouter()


@router.post("/", response_model=AppointmentRead) #AGENDAR CITA (POST) con VALIDACIÓN DE HORARIO
def create_appointment(appointment: AppointmentCreate, session: Session = Depends(get_session), current_user: users = Depends(get_current_user)):
 
   
    #Regla de Negocio: Un doctor no puede tener dos citas a la misma hora.
    
    #Validación: ¿El doctor ya está ocupado a esa hora?
    # Hacemos una consulta (SELECT * FROM appointments WHERE doctor_id = X AND fecha = Y)
    statement = select(appointments).where(
        appointments.doctor_id == appointment.doctor_id,
        appointments.fecha == appointment.fecha
    )
    if session.exec(statement).first():
        raise HTTPException(status_code=400, detail="Horario ocupado para este doctor")

    db_appointment = appointments.model_validate(appointment)
    session.add(db_appointment)
    session.commit()
    session.refresh(db_appointment)
    return db_appointment


@router.get("/", response_model=List[AppointmentRead])
def read_appointments(session: Session = Depends(get_session), current_user: users = Depends(get_current_user),fecha: Optional[date] = None,doctor_id: Optional[int] = None):

    """
    Obtiene citas. Puedes filtrar por fecha o por doctor.
    Si no envías filtros, trae todas.
    """
    query = select(appointments)

    # Si nos pidieron una fecha específica, agregamos el filtro
    if fecha:
        pass 
    
    if doctor_id:
        query = query.where(appointments.doctor_id == doctor_id)

    citas = session.exec(query).all()
    
    # Filtrado manual de fechas en (Más seguro para SQLite)
    if fecha:
        citas_filtradas = []
        for cita in citas:
            # cita.fecha es un datetime. fecha es un date.
            if cita.fecha.date() == fecha:
                citas_filtradas.append(cita)
        return citas_filtradas

    return citas



@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: int, session: Session = Depends(get_session), current_user: users = Depends(get_current_user)):
    appointment = session.get(appointments, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    session.delete(appointment)
    session.commit()
    return {"ok": True, "message": "Cita cancelada correctamente"}