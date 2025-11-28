from datetime import datetime, timedelta
from typing import Union, Any
from jose import jwt
import bcrypt

from app.config.settings import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

def get_password_hash(password: str) -> str:
   
    
    pwd_bytes = password.encode('utf-8')# Convertimos la contraseña a bytes
    
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
   
    return hashed_password.decode('utf-8') # Devolvemos el resultado como texto (string)

def verify_password(plain_password: str, hashed_password: str) -> bool: #Verifica si la contraseña coincide
    
    # Convertimos ambas a bytes para compararlas
    try:
        pwd_bytes = plain_password.encode('utf-8')
        hash_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except ValueError:
        # Si el hash no es válido o la contraseña es muy larga
        return False

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
   
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt