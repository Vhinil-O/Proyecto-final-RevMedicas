from typing import Optional
from sqlmodel import Field, SQLModel

#voy hacer varios comentarios para entender lo que estoy haciendo

#estructura dividida en 4 partes: Base, Crear, Leer y Tabla.
##pq?
#Seguridad: Para no pedir el id cuando creas un doctor (eso es automático).
#Orden: Para separar lo que el usuario escribe de lo que la base de datos guarda.

class DoctorBase(SQLModel): #la base, es decir datos compartidos
    nombre: str
    especialidad: str

class DoctorCreate(DoctorBase): #hereda doctorBase,es identico a la funcion anterior
    pass #significa literalmente no hagas nada


class DoctorRead(DoctorBase):
    id_doctor: int # Aquí sí mostramos el ID para que el frontend sepa cuál es.

class doctors(DoctorBase, table=True): #table=True le dice a SQLModel: "Crea esto en SQLite".
    id_doctor: int | None = Field(default=None, primary_key=True)
    user_id: int | None = Field(default=None, foreign_key="users.id_user") #La conexión con el usuario (Login)