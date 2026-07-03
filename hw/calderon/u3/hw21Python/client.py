import requests

# URL Base de tu servidor en la instancia EC2 de AWS [cite: 9]
BASE_URL = "http://3.20.57.154:3000/ops"

def consultar_todos_los_platos():
    """11. Obtiene la lista completa de platos del menú [cite: 346, 347]"""
    url = f"{BASE_URL}/menu/dishes"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print("🟢 MENÚ CONSULTADO CON ÉXITO:")
            resultado = response.json()
            # Como resultado es directamente una lista, iteramos sobre ella
            for plato in resultado:
                # Usamos item_id (como en tu Swagger) o itemId por si acaso
                id_plato = plato.get('item_id') or plato.get('itemId')
                print(f"- [{id_plato}] {plato.get('name')} | Precio: ${plato.get('price')}")
        else:
            print(f"🔴 Error al consultar: Código {response.status_code}")
            print(response.text)
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión: {e}")


def crear_nuevo_plato(name, price, description=None, category_id=None):
    """13. Envía un POST para registrar un nuevo plato en el sistema [cite: 391, 394]"""
    url = f"{BASE_URL}/menu/dishes"
    
    # Cuerpo de la petición con los campos requeridos y opcionales 
    payload = {
        "name": name,
        "price": float(price),
        "description": description,
        "categoryId": category_id,
        "isAvailable": True
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 201:
            print("🟢 PLATO CREADO CON ÉXITO:")
            print(response.json())
            return response.json().get("data", {}).get("itemId")
        else:
            print(f"🔴 Error al crear: Código {response.status_code}")
            print(response.text)
            return None
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión: {e}")
        return None


def actualizar_plato(dish_id, name, price, description=None, is_available=True):
    """14. Envía un PUT para modificar un plato existente mediante su ID [cite: 427, 429]"""
    url = f"{BASE_URL}/menu/dishes/{dish_id}"
    
    payload = {
        "name": name,
        "price": float(price),
        "description": description,
        "isAvailable": is_available
    }
    
    try:
        response = requests.put(url, json=payload)
        if response.status_code == 200:
            print(f"🟢 PLATO {dish_id} ACTUALIZADO CON ÉXITO:")
            print(response.json())
        elif response.status_code == 404:
            print(f"🟡 El plato con ID {dish_id} no fue encontrado en el servidor.")
        else:
            print(f"🔴 Error al actualizar: Código {response.status_code}")
            print(response.text)
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión: {e}")


# =====================================================================
# PRUEBAS DE EJECUCIÓN
# =====================================================================
if __name__ == "__main__":
    print("--- 1. Consultando platos iniciales ---")
    consultar_todos_los_platos()
    
    print("\n--- 2. Intentando crear un nuevo plato de prueba ---")
    nuevo_id = crear_nuevo_plato(
        name="Lomo Fino Premium", 
        price=24.99, 
        description="Corte de res con reducción de hongos seleccionados",
        category_id="cat-001"
    )
    
    # Si se creó con éxito y devolvió el ID, lo actualizamos inmediatamente
    if nuevo_id:
        print("\n--- 3. Modificando el plato recién creado ---")
        actualizar_plato(
            dish_id=nuevo_id,
            name="Lomo Fino Premium XL",
            price=28.50,
            description="Versión familiar con papas rústicas",
            is_available=True
        )
        
        print("\n--- 4. Consulta final para verificar cambios ---")
        consultar_todos_los_platos()