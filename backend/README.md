# Face Attendance Backend (Node.js + MongoDB)

REST API for the Face Attendance React Native app. **All data is stored in MongoDB**—employees and attendance are read from and written to the database only through this API.

- **Database name:** `face_attendance`
- **Collections:** `employees` (emp_id, name, embedding), `attendances` (emp_id, name, check_in, check_out, duration)

## Setup

1. Copy `.env.example` to `.env` and set your `MONGO_URI` (and optional `PORT`).
2. Install and run:

```bash
cd backend
npm install
npm start
```

Server runs at `http://localhost:3000` by default.

## API

- `POST /api/employees` – Register employee `{ emp_id, name, embedding }`
- `GET /api/employees` – List all employees
- `GET /api/employees/count` – Get registered count
- `DELETE /api/employees/:empId` – Delete employee
- `POST /api/attendance` – Mark attendance `{ emp_id, name }` (check-in/check-out)
- `GET /api/attendance` – List attendance records
- `GET /api/attendance/export` – Download attendance as CSV

## React Native app

Point the app at this server in `src/config/api.ts`:

- **Android emulator:** `http://10.0.2.2:3000` (default)
- **iOS simulator:** `http://localhost:3000` (default)
- **Physical device:** Use your computer’s LAN IP, e.g. `http://192.168.1.5:3000`. Find PC IP: run `ipconfig` → IPv4 Address. Same Wi‑Fi for phone and PC. If phone gets "Network request failed": run PowerShell as Admin, then `.\allow-firewall-port-3000.ps1` in the backend folder (or add Inbound Rule for TCP 3000)
