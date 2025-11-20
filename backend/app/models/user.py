from typing import Optional
from datetime import datetime
from sqlmodel import Field, SQLModel

#Modelo para poder otorgar ROLES
class users(SQLModel, table=True) : 
    id_user : int | None = Field(default=None, primary_key=True) 
    email : str = Field(index=True, unique=True)
    hashed_password: str 
    rol: str = Field(default="doctor") 
    is_active: bool = Field(default=True)