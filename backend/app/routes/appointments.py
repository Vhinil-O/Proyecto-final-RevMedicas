from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from datetime import date, datetime, timedelta # 👈 Agregamos timedelta

from app.config.database import get_session
from app.models.appointment import AppointmentCreate, AppointmentRead, appointments, AppointmentUpdate
from app.models.doctor import doctors
from app.models.user import users
from app.middleware.auth import get_current_user  

router = APIRouter()

@router.post("/", response_model=AppointmentRead)
def create_appointment(appointment: AppointmentCreate, session: Session = Depends(get_session), current_user: users = Depends(get_current_user)):

    if current_user.rol == "doctor":
        doctor_profile = session.exec(select(doctors).where(doctors.user_id == current_user.id_user)).first()
        
        if not doctor_profile:
            raise HTTPException(status_code=400, detail="Tu usuario no tiene un perfil de médico asociado.")
        
        # FORZAMOS que la cita sea para él mismo, ignorando lo que venga del frontend
        appointment.doctor_id = doctor_profile.id_doctor

    print("--------------------------------------------------")
    print(f"1. Fecha que enviaste: {appointment.fecha}")
    print(f"2. Fecha del sistema : {datetime.now()}")
    print(f"3. ¿Es pasado?       : {appointment.fecha < datetime.now()}")
    print("--------------------------------------------------")
   
    # Validacion para no agendar al pasado
    if appointment.fecha < datetime.now():
        raise HTTPException(status_code=400, detail="No puedes agendar citas en el pasado")
    if appointment.fecha.minute not in [0, 30] or appointment.fecha.second != 0:
        raise HTTPException(
            status_code=400, 
            detail="Las citas solo pueden ser en hora en punto (:00) o media hora (:30)"
        )

    # CHOQUE DE HORARIOS
    # Como ya forzamos bloques de 30 mins, basta con ver si alguien YA tiene esa hora exacta.
    
    citas_existentes = session.exec(select(appointments).where(
        appointments.doctor_id == appointment.doctor_id
    )).all()

    for cita in citas_existentes:
        # Si la diferencia es menor a 29 minutos, hay choque
        # (Usamos 29 para dar un pequeño margen de respiro al sistema)
        diferencia = abs((cita.fecha - appointment.fecha).total_seconds())
        if diferencia < 1740: # 29 minutos en segundos
            raise HTTPException(status_code=400, detail=f"El doctor ya tiene una cita ocupada a las {cita.fecha.strftime('%H:%M')}")

    # Guardar
    db_appointment = appointments.model_validate(appointment)
    session.add(db_appointment)
    session.commit()
    session.refresh(db_appointment)
     
    return db_appointment

@router.get("/", response_model=List[AppointmentRead])
def read_appointments(
    session: Session = Depends(get_session), 
    current_user: users = Depends(get_current_user), fecha: Optional[date] = None, 
    doctor_id: Optional[int] = None):
    query = select(appointments)

    # --- LÓGICA DE ROLES (NUEVO) ---
    if current_user.rol == "doctor":
        doctor_profile = session.exec(select(doctors).where(doctors.user_id == current_user.id_user)).first()
        
        if not doctor_profile:
            return [] 
            
        query = query.where(appointments.doctor_id == doctor_profile.id_doctor)
    
    # --- Si es ADMIN, entra aquí ---
    else:
        if doctor_id:
            query = query.where(appointments.doctor_id == doctor_id)

    citas = session.exec(query).all()
    
    if fecha:
        return [cita for cita in citas if cita.fecha.date() == fecha]
        
    return citas

#Obtener una sola cita
@router.get("/{appointment_id}", response_model=AppointmentRead)
def read_one_appointment(
    appointment_id: int, 
    session: Session = Depends(get_session),
    current_user: users = Depends(get_current_user)
):
    # Buscamos la cita por su ID primario
    appointment = session.get(appointments, appointment_id)
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
        
    return appointment

@router.put("/{appointment_id}", response_model=AppointmentRead)
def update_appointment(
    appointment_id:int,
    appointment_data: AppointmentUpdate,
    session: Session= Depends(get_session),
    current_user: users = Depends(get_current_user)
):
    db_appointment = session.get(appointments, appointment_id)
    if not db_appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    
    if appointment_data.fecha:
        if appointment_data.fecha < datetime.now():
            raise HTTPException(status_code=400, detail="No puedes actualizr una cita al pasado")
        
        if appointment_data.fecha.minute not in [ 0, 30 ] or appointment_data.fecha.second != 0:
            raise HTTPException(status_code=400, detail="Las citas solo pueden ser en una hora en punto (:00) o media (:30)")
        
        doctor_id_a_revisar = appointment_data.doctor_id if appointment_data.doctor_id else db_appointment.doctor_id

        citas_existentes = session.exec(select(appointments).where(
            appointments.doctor_id == doctor_id_a_revisar,
            appointments.id_appointment != appointment_id
        )).all()

        for cita in citas_existentes:
            diferencia = abs((cita.fecha - appointment_data.fecha).total_seconds())
            if diferencia < 1740: #29 minutos
                raise HTTPException(status_code=400, detail=f"El doctor ya tiene reservada una cita a las {cita.fecha.strftime('%H:%M')}")
    
    update_data = appointment_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_appointment, key, value)

    session.add(db_appointment)
    session.commit()
    session.refresh(db_appointment)

    return db_appointment

@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: int, session: Session = Depends(get_session), current_user: users = Depends(get_current_user)):
    appointment = session.get(appointments, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    session.delete(appointment)
    session.commit()
    return {"ok": True, "message": "Cita cancelada correctamente"}