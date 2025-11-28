from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from typing import Annotated

from app.config.database import get_session
from app.models.user import users
from app.utils.security import verify_password, create_access_token

router = APIRouter()


@router.post("/token") #al iniciar sesion genera un token
def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Session = Depends(get_session)
):
    """
    Recibe: username (email) y password.
    Devuelve: Access Token (JWT) si las credenciales son correctas.
    """
    
    
    statement = select(users).where(users.email == form_data.username) # Buscar al usuario por email, se adapto la logica del profesor por utilizar sql model
    user = session.exec(statement).first()

    
    
    if not user or not verify_password(form_data.password, user.hashed_password):# Verificar si existe y si la contraseña coincide
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    
    access_token = create_access_token(subject=user.email) #Se genera el token
    
    return {"access_token": access_token, "token_type": "bearer"}