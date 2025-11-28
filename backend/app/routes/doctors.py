from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.config.database import get_session #Se inporta la configuración de la base de datos (para poder abrir sesiones)
from app.models.doctor import DoctorCreate, DoctorRead, doctors #Se importan los modelos

from app.models.user import users # Para saber qué tipo de dato devuelve el guardia
from app.middleware.auth import get_current_user 

router = APIRouter()

#Por qué se unio routes y controller?: En FastAPI, la "Ruta" y la "Función" van pegadas en el mismo archivo para simplificar.

# "@" encima de una funcion (decorador) 

@router.post("/", response_model=DoctorRead)
def create_doctor(doctor: DoctorCreate, session: Session = Depends(get_session), current_user: users = Depends(get_current_user)):
    """
    Controlador para registrar un nuevo doctor.
    Recibe los datos limpios, los valida y los guarda.
    """
    db_doctor = doctors.model_validate(doctor)
    session.add(db_doctor)
    session.commit()
    session.refresh(db_doctor)
    return db_doctor


@router.get("/", response_model=List[DoctorRead])
def read_doctors(session: Session = Depends(get_session), current_user: users = Depends(get_current_user)):
    
    #Controlador para ver la agenda o lista de doctores.
    
    doctors_list = session.exec(select(doctors)).all()
    return doctors_list

@router.get("/{doctor_id}", response_model=DoctorRead)
def read_doctor(doctor_id: int, session: Session = Depends(get_session), current_user: users = Depends(get_current_user)): # LEER UNO (GET) - Para ver detalles específicos
    doctor = session.get(doctors, doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor no encontrado")
    return doctor


@router.put("/{doctor_id}", response_model=DoctorRead)
def update_doctor(doctor_id: int, doctor_data: DoctorCreate, session: Session = Depends(get_session), current_user: users = Depends(get_current_user)):
    
    db_doctor = session.get(doctors, doctor_id) #Busca el doctor 
    if not db_doctor:
        raise HTTPException(status_code=404, detail="Doctor no encontrado")
    
   
    doctor_dict = doctor_data.model_dump(exclude_unset=True)  # Actualiza los datos
    for key, value in doctor_dict.items():
        setattr(db_doctor, key, value)
    
   
    session.add(db_doctor)  #  Guardar cambios
    session.commit()
    session.refresh(db_doctor)
    return db_doctor


@router.delete("/{doctor_id}")
def delete_doctor(doctor_id: int, session: Session = Depends(get_session), current_user: users = Depends(get_current_user)):
    doctor = session.get(doctors, doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor no encontrado")
    
    session.delete(doctor)
    session.commit()
    return {"ok": True, "message": "Doctor eliminado correctamente"}