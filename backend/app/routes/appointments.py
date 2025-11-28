from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.config.database import get_session
from app.models.appointment import AppointmentCreate, AppointmentRead, appointments

router = APIRouter()


@router.post("/", response_model=AppointmentRead) #AGENDAR CITA (POST) con VALIDACIÓN DE HORARIO
def create_appointment(appointment: AppointmentCreate, session: Session = Depends(get_session)):
 
   
    #Regla de Negocio: Un doctor no puede tener dos citas a la misma hora.
    
    #Validación: ¿El doctor ya está ocupado a esa hora?
    # Hacemos una consulta (SELECT * FROM appointments WHERE doctor_id = X AND fecha = Y)
    statement = select(appointments).where(
        appointments.doctor_id == appointment.doctor_id,
        appointments.fecha == appointment.fecha
    )
    citas_existentes = session.exec(statement).first()

    if citas_existentes:
        # Si encontramos algo, detenemos todo y lanzamos error 400 (Bad Request)
        raise HTTPException(
            status_code=400, 
            detail="El doctor ya tiene una cita agendada en ese horario."
        )

    # 2. Si está libre, guardamos la cita
    db_appointment = appointments.model_validate(appointment)
    session.add(db_appointment)
    session.commit()
    session.refresh(db_appointment)
    return db_appointment

# ----------------------------------------------------------------
# 2. VER CITAS (GET)
# ----------------------------------------------------------------
@router.get("/", response_model=List[AppointmentRead])
def read_appointments(session: Session = Depends(get_session)):
    return session.exec(select(appointments)).all()

# ----------------------------------------------------------------
# 3. CANCELAR / ELIMINAR CITA (DELETE)
# ----------------------------------------------------------------
@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: int, session: Session = Depends(get_session)):
    appointment = session.get(appointments, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    session.delete(appointment)
    session.commit()
    return {"ok": True, "message": "Cita cancelada correctamente"}