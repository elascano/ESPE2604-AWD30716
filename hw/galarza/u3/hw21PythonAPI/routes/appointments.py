from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Query, HTTPException, status
from fastapi.responses import JSONResponse
from database import database
from models import AppointmentRequest, AppointmentUpdateRequest, CancelRequest
from validators import validate_date_format, validate_time_format, validate_min_anticipation

router = APIRouter()

def parse_mongo_document(document):
    if not document:
        return None
    document["id"] = str(document.pop("_id"))
    return document

async def fetch_entity_by_id(collection_name: str, entity_id: str):
    document = await database[collection_name].find_one({"_id": ObjectId(entity_id)})
    return parse_mongo_document(document)

@router.get("/available-schedules")
async def fetch_available_schedules(
    doctorId: str = Query(..., description="ID del doctor"),
    date: str = Query(..., description="Fecha en formato YYYY-MM-DD")
):
    if not validate_date_format(date):
        raise HTTPException(status_code=400, detail="El formato de fecha debe ser YYYY-MM-DD")

    try:
        target_date = datetime.strptime(date, "%Y-%m-%d")
        day_index = target_date.weekday()

        # Buscar horarios del doctor
        active_schedules = await database.work_schedules.find({
            "doctorId": doctorId,
            "dayOfWeek": day_index,
            "active": True
        }).to_list(length=None)

        if not active_schedules:
            return []

        # Buscar citas ya ocupadas
        existing_appointments = await database.appointments.find({
            "doctorId": doctorId,
            "date": date,
            "status": {"$in": ["pending", "confirmed"]}
        }).to_list(length=None)

        booked_times = {appt.get("time") for appt in existing_appointments}
        slots = []

        for schedule in active_schedules:
            start_hour, start_min = map(int, schedule["startTime"].split(":"))
            end_hour, end_min = map(int, schedule["endTime"].split(":"))
            
            current_h, current_m = start_hour, start_min

            while current_h < end_hour or (current_h == end_hour and current_m < end_min):
                time_formatted = f"{current_h:02d}:{current_m:02d}"
                is_free = time_formatted not in booked_times
                
                try:
                    if is_free:
                        validate_min_anticipation(date, time_formatted)
                except ValueError:
                    is_free = False

                slots.append({
                    "date": date,
                    "time": time_formatted,
                    "available": is_free,
                    "doctorId": doctorId
                })
                
                current_m += 30
                if current_m >= 60:
                    current_h += 1
                    current_m = 0

        return slots
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})

@router.get("/")
async def list_appointments(
    status: str = Query(None),
    patientId: str = Query(None),
    doctorId: str = Query(None)
):
    query_filters = {}
    if status:
        query_filters["status"] = status
    if patientId:
        query_filters["patientId"] = patientId
    if doctorId:
        query_filters["doctorId"] = doctorId

    cursor = database.appointments.find(query_filters).sort([("date", -1)])
    records = await cursor.to_list(length=None)
    
    response_data = []
    for record in records:
        parsed_record = parse_mongo_document(record)
        parsed_record["patient"] = await fetch_entity_by_id("patients", parsed_record.get("patientId", ""))
        parsed_record["doctor"] = await fetch_entity_by_id("doctors", parsed_record.get("doctorId", ""))
        parsed_record["therapy"] = await fetch_entity_by_id("therapies", parsed_record.get("therapyId", ""))
        response_data.append(parsed_record)

    return response_data

@router.post("/", status_code=status.HTTP_201_CREATED)
async def schedule_appointment(payload: AppointmentRequest):
    if not validate_date_format(payload.date) or not validate_time_format(payload.time):
        raise HTTPException(status_code=400, detail="Formato de fecha u hora inválido")
        
    # Lógica simplificada para inserción de citas
    appointment_data = payload.dict()
    appointment_data["status"] = "pending"
    appointment_data["createdAt"] = datetime.utcnow()
    
    result = await database.appointments.insert_one(appointment_data)
    appointment_data["_id"] = result.inserted_id
    
    return parse_mongo_document(appointment_data)
