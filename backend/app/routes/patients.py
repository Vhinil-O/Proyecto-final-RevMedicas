
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

# Importamos la sesión de base de datos
from app.config.database import get_session
# Importamos el modelo de Pacientes
from app.models.patient import PatientCreate, PatientRead, patients #Si te sale error aquí revisa que tu archivo models/patient.py tenga estas clases

from app.models.user import users # Para saber qué tipo de dato devuelve el guardia
from app.middleware.auth import get_current_user 


router = APIRouter()


@router.post("/", response_model=PatientRead) #REGISTRAR PACIENTE (POST)
def create_patient(patient: PatientCreate, session: Session = Depends(get_session), current_user: users = Depends(get_current_user)):
   
    db_patient = patients.model_validate(patient)
    session.add(db_patient)
    session.commit()
    session.refresh(db_patient)
    return db_patient

@router.get("/", response_model=List[PatientRead]) # LISTAR PACIENTES (GET)
def read_patients(session: Session = Depends(get_session), current_user: users = Depends(get_current_user)):
    """
    Obtiene la lista de todos los pacientes registrados.
    """
    patients_list = session.exec(select(patients)).all()
    return patients_list


@router.get("/{patient_id}", response_model=PatientRead) # VER UN PACIENTE (GET)
def read_patient(patient_id: int, session: Session = Depends(get_session), current_user: users = Depends(get_current_user)):
    patient = session.get(patients, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return patient


@router.put("/{patient_id}", response_model=PatientRead) #ACTUALIZAR PACIENTE (PUT)
def update_patient(patient_id: int, patient_data: PatientCreate, session: Session = Depends(get_session), current_user: users = Depends(get_current_user)):
    
    db_patient = session.get(patients, patient_id)# Buscar
    if not db_patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
   
    patient_dict = patient_data.model_dump(exclude_unset=True) #Actualizar datos (solo los que se enviaron)
    for key, value in patient_dict.items():
        setattr(db_patient, key, value)
    
   
    session.add(db_patient) #Guardar
    session.commit()
    session.refresh(db_patient)
    return db_patient


@router.delete("/{patient_id}") #ELIMINAR PACIENTE 
def delete_patient(patient_id: int, session: Session = Depends(get_session), current_user: users = Depends(get_current_user)):
    patient = session.get(patients, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    session.delete(patient)
    session.commit()
    return {"ok": True, "message": "Paciente eliminado correctamente"}