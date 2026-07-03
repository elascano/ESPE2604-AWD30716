import streamlit as st
import requests

# Configuración de la página
st.set_page_config(page_title="Biconoir's Menu", page_icon="🍽️")

BASE_URL = "http://3.20.57.154:3000/ops"

st.title("🍽️ Menú de Biconoir's Gourmet")
st.markdown("Gestión de platos conectada en tiempo real al servidor AWS.")
st.divider()

# Función para consultar la API
def obtener_platos():
    try:
        response = requests.get(f"{BASE_URL}/menu/dishes")
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"Error del servidor: {response.status_code}")
            return []
    except Exception as e:
        st.error(f"Fallo de conexión: {e}")
        return []

# Cargar los datos
platos = obtener_platos()

# Renderizar los platos en la interfaz
if platos:
    # Usamos columnas para darle un formato de "tarjetas" o cuadrícula
    for plato in platos:
        col1, col2 = st.columns([3, 1]) # Proporción de tamaño de las columnas
        
        with col1:
            st.subheader(plato.get('name', 'Plato sin nombre'))
            if plato.get('description'):
                st.write(plato.get('description'))
                
            id_plato = plato.get('item_id') or plato.get('itemId')
            st.caption(f"SKU: {id_plato}")
            
        with col2:
            st.subheader(f"${plato.get('price', '0.00')}")
            # Mostrar si está disponible
            disponible = plato.get('isAvailable', plato.get('is_available', True))
            if disponible:
                st.success("Disponible")
            else:
                st.error("Agotado")
                
        st.divider()
else:
    st.info("No hay platos registrados en el menú o no se pudo conectar.")