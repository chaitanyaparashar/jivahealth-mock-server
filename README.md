# JivaHealth Mock Server

Mock API server for the JivaHealth mobile app.

## Setup

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Server starts at `http://localhost:4000/v1`

## Deploy

```bash
npm run build
npm start
```

## OTP

Use `123456` for all phone numbers.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/health` | Health check |
| POST | `/v1/auth/send-otp` | Send OTP |
| POST | `/v1/auth/verify-otp` | Verify OTP |
| GET | `/v1/users/me` | Current user |
| GET | `/v1/family/members` | Family members |
| GET | `/v1/doctors` | Doctors list |
| GET | `/v1/appointments` | Appointments |
| GET | `/v1/consultations` | Consultations |
| GET | `/v1/prescriptions` | Prescriptions |
| GET | `/v1/pharmacy/partners` | Pharmacy partners |
| GET | `/v1/diagnostics/tests` | Diagnostic tests |
| GET | `/v1/diagnostics/suggested` | Doctor-suggested tests |
| GET | `/v1/hospitals` | Hospitals list |
| GET | `/v1/labs` | Partner labs |
| GET | `/v1/labs/:labId/tests` | Lab tests |
| GET | `/v1/labs/:labId/slots` | Lab time slots |
| GET | `/v1/symptoms` | Symptoms list |
| GET | `/v1/home/active-items` | Active items for home |
| GET | `/v1/health-records` | Health records |
| GET | `/v1/reminders` | Reminders |
| GET | `/v1/notifications` | Notifications |
| GET | `/v1/search?q=...` | Global search |
| POST | `/v1/support/callback-request` | Request callback |
| GET | `/v1/emergency` | Emergency info |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Server port |
