# Backend API – cURL / Postman

**Base URL:** `http://localhost:3000` (or your PC IP for physical device, e.g. `http://192.168.1.5:3000`)

**Headers:** `Content-Type: application/json` (for POST)

---

## Health

```bash
curl -X GET http://localhost:3000/health
```

---

## Employees

### Register employee (POST)

```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d "{\"emp_id\":\"E001\",\"name\":\"John Doe\",\"embedding\":[0.1,-0.2,0.3]}"
```

**Postman:** POST `{{baseUrl}}/api/employees`  
**Body (raw JSON):**
```json
{
  "emp_id": "E001",
  "name": "John Doe",
  "embedding": [0.1, -0.2, 0.3, 0.05, -0.1, 0.2, 0.0, 0.15, -0.05, 0.1]
}
```
*(Use 192 floats for a real face embedding from the app.)*

---

### List all employees (GET)

```bash
curl -X GET http://localhost:3000/api/employees
```

**Postman:** GET `{{baseUrl}}/api/employees`

---

### Get employee count (GET)

```bash
curl -X GET http://localhost:3000/api/employees/count
```

**Postman:** GET `{{baseUrl}}/api/employees/count`

---

### Delete employee (DELETE)

```bash
curl -X DELETE http://localhost:3000/api/employees/E001
```

**Postman:** DELETE `{{baseUrl}}/api/employees/E001` (replace `E001` with `emp_id`)

---

## Attendance

### Mark attendance – check-in / check-out (POST)

```bash
curl -X POST http://localhost:3000/api/attendance \
  -H "Content-Type: application/json" \
  -d "{\"emp_id\":\"E001\",\"name\":\"John Doe\"}"
```

**Postman:** POST `{{baseUrl}}/api/attendance`  
**Body (raw JSON):**
```json
{
  "emp_id": "E001",
  "name": "John Doe"
}
```

---

### List all attendance (GET)

```bash
curl -X GET http://localhost:3000/api/attendance
```

**Postman:** GET `{{baseUrl}}/api/attendance`

---

### Export attendance CSV (GET)

```bash
curl -X GET http://localhost:3000/api/attendance/export -o attendance.csv
```

**Postman:** GET `{{baseUrl}}/api/attendance/export` (response is CSV)

---

## Postman collection (optional)

1. New Collection → Add variable `baseUrl` = `http://localhost:3000`
2. Add requests as above with URL `{{baseUrl}}/api/employees`, etc.
3. For POST, set Body → raw → JSON and paste the JSON body.
