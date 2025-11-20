# Instalacion basica

---

## Backend

- En su navegador del sistema navegue hasta `backend` con el comando `cd backend`
- Una vez el path este en la posicion antes mencionada ejecute: `python -m venv venv` y verifique que se haya creado la carpeta `/venv`
- Si todo es correcto agregue en su linea de comando lo siguiente: `.\venv\Scripts\activate` para windows o `source ./venv/bin/activate` para Mac/Linux
- Por ultimo instale todas las dependencias necesarias, para su comodidad solo ejecute: `pip install -r requirements.txt`

Por ultimo ejecute el servidor
- `uvicorn app.main:app --reload`

---

## Frontend

Regrese a la matriz del proyecto con `cd ..` y ejecute en orden los siguiente comandos
- `npm create vite@latest frontend --template react` Seleccione `React` como framework, `JavaScript` como variante y no acepte el modo experimental
- `cd frontend`
- `npm install`
- `npm install axios`

Por ultimo ejecute el servidor
- `npm run dev`