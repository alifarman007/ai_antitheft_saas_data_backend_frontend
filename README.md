# AI Face Recognition & Antitheft SaaS Platform

A full-stack SaaS application for real-time face recognition, person detection, and email notification alerts with multi-camera support and cloud-based subscription management.

---

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Backend | FastAPI (Python) | 0.104.1 |
| Frontend | Next.js + React | 15.2.4 / React 19 |
| Database | PostgreSQL | 12+ |
| Authentication | JWT + bcrypt | HS256 |
| Styling | Tailwind CSS | 4.1.9 |
| UI Components | Radix UI | Latest |

---

## Project Structure

```
ai_antitheft_saas_data_backend_frontend/
├── backend/                    # FastAPI backend application
│   ├── main.py                 # FastAPI app & all API endpoints
│   ├── models.py               # SQLAlchemy ORM models
│   ├── schemas.py              # Pydantic validation schemas
│   ├── database.py             # Database connection config
│   └── auth.py                 # JWT & password utilities
├── app/                        # Next.js frontend pages
│   ├── page.tsx                # Landing page
│   ├── login/                  # Login page
│   ├── register/               # Registration page
│   └── dashboard/              # Dashboard pages
│       ├── page.tsx            # Main dashboard
│       ├── camera-configuration/
│       ├── face-upload/
│       └── notifications/
├── components/                 # Reusable React components
├── hooks/                      # Custom React hooks
├── lib/                        # Utilities & API client
├── uploads/                    # Uploaded files storage
│   └── faces/                  # Face images
├── database_schema.sql         # PostgreSQL schema
├── requirements.txt            # Python dependencies
├── package.json                # Node.js dependencies
└── .env                        # Environment variables
```

---

## Prerequisites

Before running the application, ensure you have installed:

- **Python** 3.12.7 or compatible version
- **Node.js** 18+ with **pnpm** package manager
- **PostgreSQL** 12 or higher

---

## 1. Database Setup (PostgreSQL)

### Start PostgreSQL Service

```bash
# Linux (systemd)
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql
```

### Create Database and Import Schema

```bash
# Create the database
PGPASSWORD=1234 psql -h localhost -U postgres -c "CREATE DATABASE ai_face_recognition;"

# Import schema with tables and sample data
PGPASSWORD=1234 psql -h localhost -U postgres -d ai_face_recognition -f database_schema.sql

# Verify tables were created
PGPASSWORD=1234 psql -h localhost -U postgres -d ai_face_recognition -c "\dt"
```

### Database Connection Details

| Parameter | Value |
|-----------|-------|
| Host | localhost |
| Port | 5432 |
| Database | ai_face_recognition |
| Username | postgres |
| Password | 1234 |

### Database Tables

| Table | Description |
|-------|-------------|
| packages | Subscription plans (Basic, Standard, Premium) |
| users | User accounts with package references |
| user_sessions | JWT session tokens |
| cameras | IP cameras and webcams |
| registered_faces | Face database for recognition |
| detection_logs | Detection history and alerts |

### Sample Data Included

- **3 Subscription Packages:** Basic ($100/mo), Standard ($500/mo), Premium ($1400/mo)
- **1 Sample User:** arafat.adi@sysnova.com
- **3 Sample Cameras:** 2 IP cameras, 1 webcam
- **8 Registered Faces:** Sample face entries
- **8 Detection Logs:** Sample detection records

---

## 2. Backend Setup (FastAPI)

### Create Virtual Environment

```bash
cd /Data/AI_Antitheft/ai_antitheft_saas_data_backend_frontend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
```

### Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Run FastAPI Server

```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Backend URLs

| URL | Description |
|-----|-------------|
| http://localhost:8000 | API Base URL |
| http://localhost:8000/docs | Swagger UI Documentation |
| http://localhost:8000/redoc | ReDoc Documentation |

### API Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | User registration |
| POST | /auth/login | User login (returns JWT) |
| GET | /auth/me | Get current user profile |

#### Packages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /packages | List all subscription packages |

#### Cameras
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /cameras | Get user's cameras |
| POST | /cameras | Create new camera |
| PUT | /cameras/{id} | Update camera |
| DELETE | /cameras/{id} | Delete camera |
| POST | /cameras/{id}/test | Test camera connection |

#### Faces
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /faces | Get registered faces |
| POST | /faces | Upload new face image |
| DELETE | /faces/{id} | Delete face |

#### Detection Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /detections | Get detection logs (paginated) |

#### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /dashboard/stats | Get today's stats |

---

## 3. Frontend Setup (Next.js)

### Install Node Dependencies

```bash
cd /Data/AI_Antitheft/ai_antitheft_saas_data_backend_frontend

pnpm install
```

### Run Development Server

```bash
pnpm dev
```

### Frontend URLs

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Main Application |
| http://localhost:3000/login | Login Page |
| http://localhost:3000/register | Registration Page |
| http://localhost:3000/dashboard | User Dashboard |

### Frontend Pages

| Page | Path | Description |
|------|------|-------------|
| Landing | / | Homepage with pricing |
| Login | /login | User authentication |
| Register | /register | New user signup |
| Dashboard | /dashboard | Main dashboard view |
| Camera Config | /dashboard/camera-configuration | Manage cameras |
| Face Upload | /dashboard/face-upload | Upload face images |
| Notifications | /dashboard/notifications | Detection logs |

---

## 4. Quick Start (All Services)

### Terminal 1 - Start PostgreSQL
```bash
sudo systemctl start postgresql
```

### Terminal 2 - Start Backend
```bash
cd /Data/AI_Antitheft/ai_antitheft_saas_data_backend_frontend
source venv/bin/activate
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 3 - Start Frontend
```bash
cd /Data/AI_Antitheft/ai_antitheft_saas_data_backend_frontend
pnpm dev
```

### Access Application
Open browser: **http://localhost:3000**

---

## 5. Environment Configuration

### Backend (.env)

```env
DATABASE_URL=postgresql://postgres:1234@localhost:5432/ai_face_recognition
SECRET_KEY=ai-face-recognition-super-secret-key-2025-secure
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200
```

### Frontend (.env.local) - Optional

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 6. Subscription Plans

| Feature | Basic ($100/mo) | Standard ($500/mo) | Premium ($1400/mo) |
|---------|-----------------|--------------------|--------------------|
| Camera Support | 1 webcam | 1 IP camera | 2 IP cameras |
| Registered Faces | 50 max | 200 max | Unlimited |
| Data Retention | 30 days | 60 days | 90 days |
| Accuracy Level | Standard | High | Premium |
| Support | Email | Priority | 24/7 Phone & Email |
| Analytics | Basic | Advanced | Full + Custom |

---

## 7. Authentication Flow

1. **Registration:** User creates account with email, password, and selects package
2. **Login:** User submits credentials, receives JWT token (30-day expiry)
3. **Token Storage:** JWT stored in browser localStorage
4. **Protected Routes:** Dashboard pages require valid JWT
5. **API Calls:** Token sent in Authorization header as Bearer token

---

## 8. File Upload Locations

| Type | Directory | Example Path |
|------|-----------|--------------|
| Face Images | uploads/faces/ | uploads/faces/1_john_photo.jpg |
| Detection Images | uploads/detections/ | uploads/detections/det_123.jpg |

---

## 9. Backend Dependencies

### Production (requirements_basic.txt)
- fastapi, uvicorn, sqlalchemy, psycopg2-binary
- pydantic, python-jose, passlib, python-multipart
- python-dotenv, email-validator, aiofiles

### Full (requirements.txt)
- All production dependencies
- opencv-python, face-recognition, numpy, pillow
- httpx, pytest, pytest-asyncio, alembic

---

## 10. Frontend Dependencies

- **Framework:** Next.js 15.2.4, React 19
- **Styling:** Tailwind CSS 4.1.9
- **UI Components:** Radix UI (dialogs, dropdowns, avatars, etc.)
- **Forms:** react-hook-form, zod validation
- **Charts:** recharts
- **Icons:** lucide-react
- **Dates:** date-fns

---

## 11. Development Commands

### Backend
```bash
# Run with auto-reload
python -m uvicorn main:app --reload --port 8000

# Run tests
pytest

# Check database connection
python -c "from database import engine; print(engine.connect())"
```

### Frontend
```bash
# Development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

---

## 12. Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check database exists
PGPASSWORD=1234 psql -h localhost -U postgres -l
```

### Backend Import Errors
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend API Connection Failed
- Verify backend is running on port 8000
- Check CORS settings in backend/main.py
- Ensure NEXT_PUBLIC_API_URL is correct

### Port Already in Use
```bash
# Find process using port
lsof -i :8000  # or :3000

# Kill process
kill -9 <PID>
```

---

## 13. Security Notes

### Current Implementation
- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with HS256 algorithm
- CORS restricted to localhost:3000, localhost:3001
- Input validation on all API endpoints
- SQL injection protection via SQLAlchemy ORM

### Production Recommendations
- Use HTTPS/TLS certificates
- Update CORS for production domain
- Use environment variables for secrets
- Implement rate limiting
- Add request logging and monitoring

---

## License

Proprietary - All rights reserved

---

## Support

For issues and support, contact the development team.
