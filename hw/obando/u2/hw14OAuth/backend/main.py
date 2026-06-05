from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jose import jwt
from datetime import datetime, timedelta
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

import os

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "").strip()



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "123456"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

class LoginData(BaseModel):
    email: str
    password: str

users_db = {
    "alejo@correo.com": {
        "password": "123",
        "name": "Alejandro"
    }
}

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/login")
async def login(user_data: LoginData):
    user = users_db.get(user_data.email)
    if not user or user["password"] != user_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user_data.email}, 
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token, "token_type": "bearer", "user": user["name"]}


class GoogleAuthRequest(BaseModel):
    token_id: str

@app.post("/api/v1/login/google")
async def google_login(request: GoogleAuthRequest):
    try:
        id_info = id_token.verify_oauth2_token(
            request.token_id, 
            google_requests.Request(), 
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10
        )
        
        user_email = id_info["email"]

        if user_email not in users_db:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario no registrado. Por favor crea una cuenta primero."
            )
        
        user_name = users_db[user_email]["name"]
        
        access_token = create_access_token(
            data={"sub": user_email}, 
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return {"access_token": access_token, "token_type": "bearer", "user": user_name}

    except ValueError as e:
        print("ERROR DE GOOGLE AUTH (LOGIN):", str(e))
        print("CLIENT ID CONFIGURADO:", GOOGLE_CLIENT_ID)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token de Google inválido: {str(e)}"
        )

@app.post("/api/v1/register/google")
async def google_register(request: GoogleAuthRequest):
    try:
        id_info = id_token.verify_oauth2_token(
            request.token_id, 
            google_requests.Request(), 
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10
        )
        
        user_email = id_info["email"]
        user_name = id_info.get("name", "")

        if user_email in users_db:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El usuario ya está registrado. Por favor inicia sesión."
            )

        users_db[user_email] = {
            "password": "",
            "name": user_name
        }
        
        access_token = create_access_token(
            data={"sub": user_email}, 
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return {"access_token": access_token, "token_type": "bearer", "user": user_name}

    except ValueError as e:
        print("ERROR DE GOOGLE AUTH (REGISTER):", str(e))
        print("CLIENT ID CONFIGURADO:", GOOGLE_CLIENT_ID)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token de Google inválido: {str(e)}"
        )
