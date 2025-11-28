from typing import Optional
from sqlmodel import Field, SQLModel


class UserBase(SQLModel):#BASE: Datos compartidos
    email: str = Field(unique=True, index=True)
    rol: str = Field(default="doctor")
    is_active: bool = Field(default=True)


class UserCreate(UserBase): #CREAR: Aquí SÍ pedimos contraseña (texto plano)
    password: str


class UserRead(UserBase):# 3. LEER: Aquí NUNCA devolvemos la contraseña
    id_user: int


class users(UserBase, table=True):# 4. TABLA: Aquí guardamos la contraseña ENCRIPTADA (hashed)
    id_user: int | None = Field(default=None, primary_key=True)
    hashed_password: str