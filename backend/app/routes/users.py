from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.config.database import get_session
from app.models.user import UserCreate, UserRead, users
from app.utils.security import get_password_hash 

from app.middleware.auth import get_current_user
from app.models.user import users

router = APIRouter()


@router.post("/", response_model=UserRead)
def create_user(user: UserCreate, session: Session = Depends(get_session)):
    
    #Registra un nuevo usuario (Admin o Doctor).
    #IMPORTANTE: Aquí encriptamos la contraseña antes de guardar.
   
    statement = select(users).where(users.email == user.email) # 1. Validar que el email no exista ya
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    # Encriptar la contraseña 
   
    user_data = user.model_dump()  # Convertimos el modelo a diccionario para manipularlo
    texto_plano = user_data.pop("password") # Sacamos la contraseña plana
    
    # Creamos la instancia de la tabla con la contraseña encriptada
    db_user = users(
        **user_data, # Pone el email, rol, etc.
        hashed_password=get_password_hash(texto_plano) # Pone la contraseña segura
    )
    
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@router.get("/", response_model=List[UserRead])
def read_users(session: Session = Depends(get_session), current_user: users = Depends(get_current_user)):
    return session.exec(select(users)).all()