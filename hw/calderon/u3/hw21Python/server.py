from fastapi import FastAPI
import requests

app = FastAPI(title="Servidor Local de URIs para Postman")

# URL de tu instancia EC2 en AWS
AWS_BASE_URL = "http://3.20.57.154:3000/ops"

@st_route := app.get("/menu/dishes")
def obtener_dishes_para_postman():
    """Esta ruta será consumida por Postman"""
    url = f"{AWS_BASE_URL}/menu/dishes"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            # Retornamos directamente la lista de platos en formato JSON
            return response.json()
        else:
            return {"error": f"Error en AWS: {response.status_code}", "detalle": response.text}
    except Exception as e:
        return {"error": "No se pudo conectar con el servidor de AWS", "detalle": str(e)}