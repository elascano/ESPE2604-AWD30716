#!/bin/bash

BASE_URL="http://localhost:8080"
API_URL="$BASE_URL/api"

echo "=========================================================="
echo "   ALCSystem v2 - MASTER API COMPLIANCE TEST (28 ROUTES)  "
echo "=========================================================="

# Robust JSON extraction
get_field() { echo "$1" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('$2', ''))" 2>/dev/null; }
get_nested() { echo "$1" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('$2', {}).get('$3', ''))" 2>/dev/null; }
get_data_id() { echo "$1" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('id', ''))" 2>/dev/null; }

# --- AUTHENTICATION ---
echo "--- Auth Initialization ---"
DIR_TOKEN=$(get_field "$(curl -s -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"director@americanlatinclass.com","password":"ALC2026*","role":"director"}')" "token")
TEA_TOKEN=$(get_field "$(curl -s -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"teacher@americanlatinclass.com","password":"ALC2026*","role":"teacher"}')" "token")
STU_TOKEN=$(get_field "$(curl -s -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"student@americanlatinclass.com","password":"ALC2026*","role":"student"}')" "token")

if [ -z "$DIR_TOKEN" ]; then echo "FAIL: Token generation failed."; exit 1; fi
echo "Tokens: OK"
echo ""

# --- ENDPOINTS 1-28 ---
TS=$(date +%s)
ID_VALID="1723456784"
ID_VALID2="1710034065"

echo -n "1. GET /: "; if curl -s "$BASE_URL/" | grep -q "American Latin Class"; then echo "OK"; else echo "FAIL"; fi
echo -n "2. GET /api/health: "; if curl -s "$API_URL/health" | grep -q "status"; then echo "OK"; else echo "FAIL"; fi
echo -n "3. GET /api/branches: "; if curl -s "$API_URL/branches" | grep -q "Matrix"; then echo "OK"; else echo "FAIL"; fi

echo -n "4. POST /api/enrollments: "
EN_RES=$(curl -s -X POST "$API_URL/enrollments" -H "Content-Type: application/json" -d "{\"branch_id\":1,\"national_id\":\"$ID_VALID\",\"full_name\":\"Test Student\",\"email\":\"en_$TS@example.com\",\"phone\":\"0987654321\",\"level\":\"B1\"}")
if echo "$EN_RES" | grep -q -e "registered" -e "already"; then echo "OK"; else echo "FAIL ($EN_RES)"; fi

echo -n "5. POST /api/auth/login: "; echo "OK"

echo -n "6. POST /api/kiosk/attendance: "
KI_RES=$(curl -s -X POST "$API_URL/kiosk/attendance" -H "Content-Type: application/json" -d "{\"national_id\":\"1712345678\"}")
if echo "$KI_RES" | grep -q -e "registered" -e "already"; then echo "OK"; else echo "FAIL ($KI_RES)"; fi

echo -n "7. POST /api/teacher-attendance/check-in: "
TC_RES=$(curl -s -X POST "$API_URL/teacher-attendance/check-in" -H "Content-Type: application/json" -d '{"email":"teacher@americanlatinclass.com","branch_id":1,"expected_start_time":"18:00","duration_hours":1,"style":"Urban"}')
if echo "$TC_RES" | grep -q "registered"; then echo "OK"; else echo "FAIL ($TC_RES)"; fi

echo -n "8. GET /api/me: "; ME_RES=$(curl -s -X GET "$API_URL/me" -H "Authorization: Bearer $DIR_TOKEN"); if echo "$ME_RES" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('user', {}).get('role', ''))" | grep -q "director"; then echo "OK"; else echo "FAIL ($ME_RES)"; fi
echo -n "9. GET /api/me/attendance: "; if curl -s -X GET "$API_URL/me/attendance" -H "Authorization: Bearer $STU_TOKEN" | grep -q '"data"'; then echo "OK"; else echo "FAIL"; fi
echo -n "10. PATCH /api/me/photo: "; if curl -s -X PATCH "$API_URL/me/photo" -H "Authorization: Bearer $STU_TOKEN" -H "Content-Type: application/json" -d '{"photo_url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="}' | grep -q "updated"; then echo "OK"; else echo "FAIL"; fi

echo -n "11. GET /api/students: "; if curl -s -X GET "$API_URL/students" -H "Authorization: Bearer $DIR_TOKEN" | grep -q '"data"'; then echo "OK"; else echo "FAIL"; fi

echo -n "12. POST /api/students (B2): "
STU_RES=$(curl -s -X POST "$API_URL/students" -H "Authorization: Bearer $DIR_TOKEN" -H "Content-Type: application/json" -d "{\"branch_id\":1,\"national_id\":\"$ID_VALID2\",\"full_name\":\"Dancer Name\",\"email\":\"b2_$TS@example.com\",\"phone\":\"0991112222\",\"level\":\"B2\",\"status\":\"active\"}")
B2_ID=$(get_data_id "$STU_RES")
if [ ! -z "$B2_ID" ]; then echo "OK (ID: $B2_ID)"; else echo "FAIL ($STU_RES)"; fi

echo -n "13. PATCH /api/students/{id}: "; if [ ! -z "$B2_ID" ]; then curl -s -X PATCH "$API_URL/students/$B2_ID" -H "Authorization: Bearer $DIR_TOKEN" -H "Content-Type: application/json" -d '{"full_name":"Updated Name"}' | grep -q "updated" && echo "OK" || echo "FAIL"; else echo "SKIP"; fi
echo -n "14. DELETE /api/students/{id}: "; if [ ! -z "$B2_ID" ]; then curl -s -X DELETE "$API_URL/students/$B2_ID" -H "Authorization: Bearer $DIR_TOKEN" | grep -q "deactivated" && echo "OK" || echo "FAIL"; else echo "SKIP"; fi

echo -n "15. GET /api/teachers: "; if curl -s -X GET "$API_URL/teachers" -H "Authorization: Bearer $DIR_TOKEN" | grep -q '"data"'; then echo "OK"; else echo "FAIL"; fi
echo -n "16. POST /api/teachers: "
TEA_RES=$(curl -s -X POST "$API_URL/teachers" -H "Authorization: Bearer $DIR_TOKEN" -H "Content-Type: application/json" -d "{\"name\":\"Test Teacher\",\"email\":\"t_$TS@example.com\",\"branch_id\":1,\"password\":\"ALC2026*\"}")
T_ID=$(get_data_id "$TEA_RES")
if [ ! -z "$T_ID" ]; then echo "OK (ID: $T_ID)"; else echo "FAIL"; fi

echo -n "17. PATCH /api/teachers/{id}: "; curl -s -X PATCH "$API_URL/teachers/$T_ID" -H "Authorization: Bearer $DIR_TOKEN" -H "Content-Type: application/json" -d '{"name":"New Name"}' | grep -q "updated" && echo "OK" || echo "FAIL"
echo -n "18. DELETE /api/teachers/{id}: "; curl -s -X DELETE "$API_URL/teachers/$T_ID" -H "Authorization: Bearer $DIR_TOKEN" | grep -q "deactivated" && echo "OK" || echo "FAIL"

echo -n "19. GET /api/class-plans: "; if curl -s -X GET "$API_URL/class-plans" -H "Authorization: Bearer $TEA_TOKEN" | grep -q '"data"'; then echo "OK"; else echo "FAIL"; fi
echo -n "20. POST /api/class-plans: "; if curl -s -X POST "$API_URL/class-plans" -H "Authorization: Bearer $TEA_TOKEN" -H "Content-Type: application/json" -d '{"branch_id":1,"teacher_name":"Andrea","month":"2026-06","level":"B1","objective":"Obj","activities":"Act"}' | grep -q "submitted"; then echo "OK"; else echo "FAIL"; fi
echo -n "21. GET /api/attendance-records: "; if curl -s -X GET "$API_URL/attendance-records" -H "Authorization: Bearer $DIR_TOKEN" | grep -q '"data"'; then echo "OK"; else echo "FAIL"; fi
echo -n "22. POST /api/attendance-records: "; if curl -s -X POST "$API_URL/attendance-records" -H "Authorization: Bearer $TEA_TOKEN" -H "Content-Type: application/json" -d '{"branch_id":1,"person_type":"student","person_name":"Mateo","level":"B1","attendance_date":"2026-06-08","status":"present"}' | grep -q "registered"; then echo "OK"; else echo "FAIL"; fi
echo -n "23. GET /api/branch-finance-reports: "; if curl -s -X GET "$API_URL/branch-finance-reports" -H "Authorization: Bearer $DIR_TOKEN" | grep -q '"data"'; then echo "OK"; else echo "FAIL"; fi
echo -n "24. POST /api/branch-finance-reports: "; if curl -s -X POST "$API_URL/branch-finance-reports" -H "Authorization: Bearer $DIR_TOKEN" -H "Content-Type: application/json" -d '{"branch_id":1,"month":"2026-06","income":1000,"expenses":200,"matrix_share_percent":15}' | grep -q "id"; then echo "OK"; else echo "FAIL"; fi
echo -n "25. GET /api/professional-events: "; if curl -s -X GET "$API_URL/professional-events" -H "Authorization: Bearer $DIR_TOKEN" | grep -q '"data"'; then echo "OK"; else echo "FAIL"; fi
echo -n "26. POST /api/professional-events: "
EV_RES=$(curl -s -X POST "$API_URL/professional-events" -H "Authorization: Bearer $DIR_TOKEN" -H "Content-Type: application/json" -d "{\"branch_id\":1,\"client_name\":\"Client $TS\",\"event_type\":\"Show\",\"event_date\":\"2026-06-15\",\"total_amount\":500}")
EV_ID=$(get_data_id "$EV_RES")
if [ ! -z "$EV_ID" ]; then echo "OK (ID: $EV_ID)"; else echo "FAIL"; fi

echo -n "27. POST /api/professional-events/{id}/assignments: "; if [ ! -z "$B2_ID" ] && [ ! -z "$EV_ID" ]; then curl -s -X POST "$API_URL/professional-events/$EV_ID/assignments" -H "Authorization: Bearer $DIR_TOKEN" -H "Content-Type: application/json" -d "{\"student_id\":$B2_ID,\"gross_amount\":100}" | grep -q "registered" && echo "OK" || echo "FAIL"; else echo "SKIP"; fi
echo -n "28. GET /api/dancer-settlements/{id}: "; if [ ! -z "$B2_ID" ]; then curl -s -X GET "$API_URL/dancer-settlements/$B2_ID" -H "Authorization: Bearer $DIR_TOKEN" | grep -q '"data"' && echo "OK" || echo "FAIL"; else echo "SKIP"; fi

echo ""
echo "--- Frontend Checks ---"
for f in index.html pricing.html enrollment.html login.html attendance-kiosk.html dashboard.html; do [ -f "06Code/frontend/$f" ] && echo "File $f: OK" || echo "File $f: MISSING"; done

echo "=========================================================="
echo "                COMPLIANCE TEST COMPLETED                 "
echo "=========================================================="
