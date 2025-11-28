from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlmodel import Session, select


from app.config.settings import SECRET_KEY, ALGORITHM
from app.config.database import get_session
from app.models.user import users

# EXPLICACIÓN DE SINTAXIS 
# OAuth2PasswordBearer: Es una clase de FastAPI que le dice a Swagger:
# "Oye, para estas rutas necesito un token. Pon un botón de candadito 
# y si el usuario lo usa, manda las credenciales a la ruta '/token'".
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)): # Esta es la función guardia. Se ejecutará antes de entrar a cualquier ruta protegida.
    
    # Preparamos el error "401 No Autorizado" por si algo sale mal
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # DECODIFICAR EL TOKEN
        # jwt.decode intenta abrir el token usando tu firma (SECRET_KEY).
        # Si la firma no coincide (es un token falso), lanza error.
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # EXTRAER EL EMAIL (SUBJECT)
        # El token guarda el email en el campo "sub".
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
            
    except JWTError: # Si el token expiró o está roto
        raise credentials_exception

    # BUSCAR AL USUARIO EN LA BASE DE DATOS
    # Verificamos que el usuario del token realmente exista en el sistema
    statement = select(users).where(users.email == email)
    user = session.exec(statement).first()
    
    if user is None:
        raise credentials_exception
        
        
    return user # Si todo salió bien, devolvemos el objeto 'user' a la ruta que lo pidió.