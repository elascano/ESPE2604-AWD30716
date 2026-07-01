import os
import re
from datetime import datetime, date
from typing import Optional
from dotenv import load_dotenv
import jwt
from flask import Flask, request, jsonify, Response
from sqlalchemy import create_engine, Column, BigInteger, String, Date as SQLDate, DateTime, select
from sqlalchemy.orm import declarative_base, sessionmaker

# ─── ENV LOADING ─────────────────────────────────────────────────────────────
load_dotenv()

for rel_path in ["..", "../business-logic", "../env"]:
    p = os.path.abspath(os.path.join(os.path.dirname(__file__), rel_path))
    if os.path.isfile(p):
        load_dotenv(dotenv_path=p)
    elif os.path.isfile(os.path.join(p, ".env")):
        load_dotenv(dotenv_path=os.path.join(p, ".env"))

# ─── DATABASE SETUP ──────────────────────────────────────────────────────────
DATABASE_URL = os.getenv("DIRECT_URL") or os.getenv("DATABASE_URL")
is_sqlite = False

if DATABASE_URL:
    if "?" in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.split("?")[0]
    if DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+pg8000://", 1)
    try:
        test_engine = create_engine(DATABASE_URL, connect_args={"timeout": 3})
        with test_engine.connect():
            pass
        print("Connected to PostgreSQL successfully!")
    except Exception as e:
        print(f"PostgreSQL failed ({e}). Falling back to SQLite.")
        DATABASE_URL = "sqlite:///./local_patients.db"
        is_sqlite = True
else:
    DATABASE_URL = "sqlite:///./local_patients.db"
    is_sqlite = True

if is_sqlite:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ─── MODEL ───────────────────────────────────────────────────────────────────
class PatientModel(Base):
    __tablename__ = "patients"
    patientID = Column(BigInteger, primary_key=True, index=True)
    fullName = Column(String, nullable=True)
    birthday = Column(SQLDate, nullable=True)
    phone = Column(String, nullable=True)
    reasonForConsultation = Column(String, nullable=True)
    legalRepresentative = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# ─── FLASK APP ───────────────────────────────────────────────────────────────
app = Flask(__name__)

CRUD_API_KEY = os.getenv("CRUD_API_KEY", "admin")
JWT_SECRET   = os.getenv("JWT_SECRET", "fabuladental_jwt_super_secreto_2024")
VALID_GENDERS = {'masculino', 'femenino', 'otro', 'male', 'female', 'other'}

# ─── HELPERS ─────────────────────────────────────────────────────────────────
def parse_birthday(value) -> Optional[date]:
    if not value:
        return None
    raw = str(value).strip()
    m = re.match(r"^(\d{1,2})/(\d{1,2})/(\d{4})$", raw)
    if m:
        try:
            parsed = date(int(m.group(3)), int(m.group(2)), int(m.group(1)))
        except ValueError:
            return None
    else:
        try:
            raw2 = raw.split("T")[0] if "T" in raw else raw
            parsed = datetime.strptime(raw2, "%Y-%m-%d").date()
        except ValueError:
            return None
    return None if parsed > date.today() else parsed

def get_age(bday: date):
    today = date.today()
    years = today.year - bday.year
    months = today.month - bday.month
    if today.day < bday.day:
        months -= 1
    if months < 0:
        years -= 1
        months += 12
    total_days = (today - bday).days
    return years, months, total_days

def get_clinical_category(years, total_days):
    if total_days <= 27:  return 'Neonate',     '0.1x'
    if years < 1:         return 'Infant',       '0.2x'
    if years < 4:         return 'Toddler',      '0.35x'
    if years < 7:         return 'Pre-schooler', '0.5x'
    if years < 12:        return 'School-age',   '0.75x'
    if years < 18:        return 'Adolescent',   '0.85x'
    return 'Adult', '1.0x'

def get_db():
    return SessionLocal()

# ─── MIDDLEWARE HELPERS ───────────────────────────────────────────────────────
def require_api_key():
    key = request.headers.get("x-api-key")
    if not key or key != CRUD_API_KEY:
        return jsonify({"error": "Authentication failure"}), 401
    return None

def require_role(allowed_roles):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return jsonify({"error": "Access denied. Token required."}), 401
    token = auth.split(" ", 1)[1]
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        if decoded.get("role") not in allowed_roles:
            return jsonify({"error": "Forbidden. You do not have the required permissions."}), 403
        return None
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Invalid or expired token."}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid or expired token."}), 401

def patient_to_dict(p):
    return {
        "patientID": str(p.patientID),
        "fullName": p.fullName,
        "birthday": p.birthday.isoformat() if p.birthday else None,
        "phone": p.phone,
        "gender": p.gender,
        "reasonForConsultation": p.reasonForConsultation,
        "legalRepresentative": p.legalRepresentative,
        "created_at": p.created_at.isoformat() if p.created_at else None,
    }

def validate_patient_body(body, require_id=False):
    errors = []
    pid = None
    if require_id:
        try:
            pid = int(body.get("patientID", ""))
        except (ValueError, TypeError):
            errors.append("Invalid patientID")

    full_name = (body.get("fullName") or "").strip()
    phone     = (body.get("phone") or "").strip()
    gender    = (body.get("gender") or "").strip().lower()
    reason    = (body.get("reasonForConsultation") or "").strip()
    legal_rep = (body.get("legalRepresentative") or "").strip()
    bday      = parse_birthday(body.get("birthday"))

    if not full_name or len(full_name) < 3:
        errors.append("fullName must be at least 3 characters")
    if not bday:
        errors.append("Invalid birthday")
    if not re.match(r"^[0-9]{10}$", phone):
        errors.append("phone must be 10 digits")
    if gender not in VALID_GENDERS:
        errors.append(f"gender must be one of {VALID_GENDERS}")
    if not reason or len(reason) < 5:
        errors.append("reasonForConsultation must be at least 5 characters")

    if bday:
        years, _, _ = get_age(bday)
        if years < 18 and not legal_rep:
            errors.append("legalRepresentative is required for minors")

    if errors:
        return None, errors

    return {
        "patientID": pid,
        "fullName": full_name,
        "birthday": bday,
        "phone": phone,
        "gender": body.get("gender", "").strip(),
        "reasonForConsultation": reason,
        "legalRepresentative": legal_rep or None,
    }, []

# ─── CRUD ROUTES ─────────────────────────────────────────────────────────────
@app.post("/fabuladental/patients")
def create_patient():
    err = require_api_key()
    if err: return err

    data, errors = validate_patient_body(request.json or {}, require_id=True)
    if errors:
        return jsonify({"error": "Missing required fields.", "details": errors}), 400

    db = get_db()
    try:
        existing = db.execute(select(PatientModel).where(PatientModel.patientID == data["patientID"])).scalar_one_or_none()
        if existing:
            return jsonify({"error": "Patient ID already exists."}), 400
        db.add(PatientModel(**data))
        db.commit()
        return jsonify({"success": True, "message": "Patient registered successfully"}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": "Something went wrong. Please try again later."}), 500
    finally:
        db.close()

@app.get("/fabuladental/patients")
def get_patients():
    err = require_api_key()
    if err: return err
    db = get_db()
    try:
        patients = db.execute(select(PatientModel)).scalars().all()
        return jsonify([patient_to_dict(p) for p in patients])
    except Exception:
        return jsonify({"error": "Unable to fetch patients."}), 400
    finally:
        db.close()

@app.get("/fabuladental/patients/<patient_id>")
def get_patient(patient_id):
    err = require_api_key()
    if err: return err
    try:
        pid = int(patient_id)
    except ValueError:
        return jsonify({"error": "Patient ID is required."}), 400
    db = get_db()
    try:
        p = db.execute(select(PatientModel).where(PatientModel.patientID == pid)).scalar_one_or_none()
        if not p:
            return jsonify({"error": "Patient not found."}), 404
        return jsonify(patient_to_dict(p))
    except Exception:
        return jsonify({"error": "Unable to fetch patient."}), 500
    finally:
        db.close()

@app.put("/fabuladental/patients/<patient_id>")
def update_patient(patient_id):
    err = require_api_key()
    if err: return err
    try:
        pid = int(patient_id)
    except ValueError:
        return jsonify({"error": "Patient ID is required."}), 400

    data, errors = validate_patient_body(request.json or {}, require_id=False)
    if errors:
        return jsonify({"error": "Missing required fields.", "details": errors}), 400

    db = get_db()
    try:
        p = db.execute(select(PatientModel).where(PatientModel.patientID == pid)).scalar_one_or_none()
        if not p:
            return jsonify({"error": "Patient not found."}), 404
        for field in ["fullName", "birthday", "phone", "gender", "reasonForConsultation", "legalRepresentative"]:
            setattr(p, field, data[field])
        db.commit()
        return jsonify({"success": True, "message": "Patient updated"})
    except Exception:
        db.rollback()
        return jsonify({"error": "Something went wrong."}), 500
    finally:
        db.close()

@app.delete("/fabuladental/patients/<patient_id>")
def delete_patient(patient_id):
    err = require_api_key()
    if err: return err
    try:
        pid = int(patient_id)
    except ValueError:
        return jsonify({"error": "Invalid or missing patient ID."}), 400
    db = get_db()
    try:
        p = db.execute(select(PatientModel).where(PatientModel.patientID == pid)).scalar_one_or_none()
        if not p:
            return jsonify({"error": "Patient not found."}), 404
        db.delete(p)
        db.commit()
        return jsonify({"success": True, "message": "Patient deleted"})
    except Exception:
        db.rollback()
        return jsonify({"error": "Deletion failed."}), 500
    finally:
        db.close()

# ─── BUSINESS LOGIC ROUTES ───────────────────────────────────────────────────
@app.post("/fabuladental/patients/pediatric-category")
def pediatric_category():
    err = require_role(["Dentist"])
    if err: return err
    body    = request.json or {}
    bday    = parse_birthday(body.get("birthday") or body.get("dateOfBirth"))
    if not bday:
        return jsonify({"error": "Valid birthday format required."}), 400
    years, months, total_days = get_age(bday)
    category, factor = get_clinical_category(years, total_days)
    return jsonify({"calculatedAgeYears": years, "calculatedAgeMonths": months,
                    "pediatricCategory": category, "dosageRestrictionFactor": factor})

@app.post("/fabuladental/patients/legal-representative-validation")
def legal_rep_validation():
    err = require_role(["Dentist"])
    if err: return err
    body     = request.json or {}
    bday     = parse_birthday(body.get("birthday") or body.get("dateOfBirth"))
    legal    = (body.get("legalRepresentative") or "").strip()
    if not bday:
        return jsonify({"error": "Valid birthday format required."}), 400
    years, _, _ = get_age(bday)
    if years < 18 and not legal:
        return jsonify({"error": "Patient is underage, legal representative is required."}), 400
    return jsonify({"valid": True, "requiresLegalRepresentative": years < 18,
                    "message": "Legal representative not required." if years >= 18 else "Legal representative provided successfully."})

@app.post("/fabuladental/patients/days-to-birthday")
def days_to_birthday():
    err = require_role(["Dentist"])
    if err: return err
    body = request.json or {}
    bday = parse_birthday(body.get("birthday") or body.get("dateOfBirth"))
    if not bday:
        return jsonify({"error": "Valid birthday format required."}), 400
    today = date.today()
    try:
        next_bday = date(today.year, bday.month, bday.day)
    except ValueError:
        next_bday = date(today.year, 3, 1)
    if next_bday < today:
        try:
            next_bday = date(today.year + 1, bday.month, bday.day)
        except ValueError:
            next_bday = date(today.year + 1, 3, 1)
    days = (next_bday - today).days
    return jsonify({"daysUntilBirthday": days, "isBirthdayWeek": days <= 7})

@app.post("/fabuladental/patients/senior-discount")
def senior_discount():
    err = require_role(["Receptionist"])
    if err: return err
    body = request.json or {}
    bday = parse_birthday(body.get("birthday") or body.get("dateOfBirth"))
    if not bday:
        return jsonify({"error": "Valid birthday format required."}), 400
    years, _, _ = get_age(bday)
    eligible = years >= 65
    return jsonify({"suggestedDiscountFactor": 0.50 if eligible else 0.00, "isEligibleForDiscount": eligible})

@app.post("/fabuladental/patients/consultation-time-estimation")
def consultation_time():
    err = require_role(["Dentist"])
    if err: return err
    body   = request.json or {}
    bday   = parse_birthday(body.get("birthday") or body.get("dateOfBirth"))
    reason = body.get("reasonForConsultation") or ""
    if not bday:
        return jsonify({"error": "Valid birthday format required."}), 400
    years, _, _ = get_age(bday)
    mins = 15
    if years < 5 or years > 70:
        mins += 10
    if len(reason) > 50:
        mins += 10
    return jsonify({"estimatedConsultationMinutes": mins, "baseMinutes": 15})

@app.post("/fabuladental/patients/contact-priority")
def contact_priority():
    err = require_role(["Receptionist"])
    if err: return err
    body   = request.json or {}
    phone  = body.get("phone") or ""
    reason = (body.get("reasonForConsultation") or "").lower()
    score  = 10 if len(phone) >= 10 else 0
    if any(kw in reason for kw in ["dolor", "urgencia", "sangrado", "emergencia"]):
        score += 50
    return jsonify({"contactPriorityScore": score, "requiresImmediateAttention": score >= 50})

# ─── SWAGGER UI DOCS ─────────────────────────────────────────────────────────
@app.get("/openapi.json")
def openapi_spec():
    # Detect base URL with stage (e.g. https://xxx.execute-api.us-east-2.amazonaws.com/dev)
    current_url = request.url  # e.g. https://xxx.../dev/openapi.json
    base_url = current_url.replace("/openapi.json", "").rstrip("/")
    spec = {
        "openapi": "3.0.0",
        "info": {"title": "Fábula Dental Patients API (Python)", "version": "1.0.0"},
        "servers": [{"url": base_url, "description": "Current server"}],
        "components": {
            "securitySchemes": {
                "ApiKeyAuth": {"type": "apiKey", "in": "header", "name": "x-api-key"},
                "BearerAuth": {"type": "http", "scheme": "bearer"}
            }
        },
        "paths": {
            "/fabuladental/patients": {
                "post": {"summary": "Create Patient", "security": [{"ApiKeyAuth": []}],
                    "requestBody": {"required": True, "content": {"application/json": {"schema": {"type": "object",
                        "properties": {"patientID": {"type": "integer"}, "fullName": {"type": "string"},
                            "birthday": {"type": "string", "example": "01/01/1990"}, "phone": {"type": "string"},
                            "gender": {"type": "string", "enum": ["masculino","femenino","otro","male","female","other"]},
                            "reasonForConsultation": {"type": "string"}, "legalRepresentative": {"type": "string"}},
                        "required": ["patientID","fullName","birthday","phone","gender","reasonForConsultation"]}}}},
                    "responses": {"201": {"description": "Patient registered successfully"}}},
                "get": {"summary": "Get Patients", "security": [{"ApiKeyAuth": []}],
                    "responses": {"200": {"description": "List of patients"}}}
            },
            "/fabuladental/patients/{patientId}": {
                "get": {"summary": "Get Patient", "security": [{"ApiKeyAuth": []}],
                    "parameters": [{"name": "patientId", "in": "path", "required": True, "schema": {"type": "integer"}}],
                    "responses": {"200": {"description": "Patient data"}, "404": {"description": "Not found"}}},
                "put": {"summary": "Update Patient", "security": [{"ApiKeyAuth": []}],
                    "parameters": [{"name": "patientId", "in": "path", "required": True, "schema": {"type": "integer"}}],
                    "requestBody": {"required": True, "content": {"application/json": {"schema": {"type": "object"}}}},
                    "responses": {"200": {"description": "Patient updated"}}},
                "delete": {"summary": "Delete Patient", "security": [{"ApiKeyAuth": []}],
                    "parameters": [{"name": "patientId", "in": "path", "required": True, "schema": {"type": "integer"}}],
                    "responses": {"200": {"description": "Patient deleted"}}}
            },
            "/fabuladental/patients/pediatric-category": {
                "post": {"summary": "Calculate Patient Pediatric Category", "security": [{"BearerAuth": []}],
                    "requestBody": {"required": True, "content": {"application/json": {"schema": {"type": "object",
                        "properties": {"birthday": {"type": "string", "example": "01/01/2015"}}}}}},
                    "responses": {"200": {"description": "Pediatric category data"}}}
            },
            "/fabuladental/patients/legal-representative-validation": {
                "post": {"summary": "Validate Legal Representative", "security": [{"BearerAuth": []}],
                    "requestBody": {"required": True, "content": {"application/json": {"schema": {"type": "object",
                        "properties": {"birthday": {"type": "string"}, "legalRepresentative": {"type": "string"}}}}}},
                    "responses": {"200": {"description": "Validation result"}}}
            },
            "/fabuladental/patients/days-to-birthday": {
                "post": {"summary": "Calculate Days To Birthday", "security": [{"BearerAuth": []}],
                    "requestBody": {"required": True, "content": {"application/json": {"schema": {"type": "object",
                        "properties": {"birthday": {"type": "string"}}}}}},
                    "responses": {"200": {"description": "Days until birthday"}}}
            },
            "/fabuladental/patients/senior-discount": {
                "post": {"summary": "Calculate Senior Discount", "security": [{"BearerAuth": []}],
                    "requestBody": {"required": True, "content": {"application/json": {"schema": {"type": "object",
                        "properties": {"birthday": {"type": "string"}}}}}},
                    "responses": {"200": {"description": "Senior discount info"}}}
            },
            "/fabuladental/patients/consultation-time-estimation": {
                "post": {"summary": "Estimate Consultation Time", "security": [{"BearerAuth": []}],
                    "requestBody": {"required": True, "content": {"application/json": {"schema": {"type": "object",
                        "properties": {"birthday": {"type": "string"}, "reasonForConsultation": {"type": "string"}}}}}},
                    "responses": {"200": {"description": "Estimated consultation time"}}}
            },
            "/fabuladental/patients/contact-priority": {
                "post": {"summary": "Calculate Contact Priority", "security": [{"BearerAuth": []}],
                    "requestBody": {"required": True, "content": {"application/json": {"schema": {"type": "object",
                        "properties": {"phone": {"type": "string"}, "reasonForConsultation": {"type": "string"}}}}}},
                    "responses": {"200": {"description": "Contact priority score"}}}
            }
        }
    }
    return jsonify(spec)

@app.get("/docs")
def swagger_ui():
    html = """<!DOCTYPE html>
<html>
<head>
  <title>Fábula Dental Patients API</title>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    // Dynamically build the openapi.json URL based on the current page URL
    // Works both locally (/docs) and on AWS API Gateway (/dev/docs)
    const docsUrl = window.location.href;
    const openApiUrl = docsUrl.replace(/\/docs\/?.*$/, '/openapi.json');
    SwaggerUIBundle({
      url: openApiUrl,
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: "BaseLayout",
      deepLinking: true
    })
  </script>
</body>
</html>"""
    return Response(html, mimetype="text/html")

# ─── LOCAL DEV SERVER ────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
