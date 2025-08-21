from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session, joinedload
import uvicorn
from typing import Optional, List
import os

from database import get_db, engine, Base
from models import User, Camera, RegisteredFace, DetectionLog, Package, UserSession
from schemas import (
    UserCreate, UserLogin, UserResponse, 
    CameraCreate, CameraResponse, CameraUpdate,
    FaceCreate, FaceResponse,
    DetectionLogResponse,
    PackageResponse,
    Token
)
from auth import (
    create_access_token, verify_token, get_password_hash, 
    verify_password, get_current_user
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Face Recognition API",
    description="Backend API for AI Face Recognition SaaS Platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
os.makedirs("uploads/faces", exist_ok=True)
os.makedirs("uploads/detections", exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

security = HTTPBearer()

# Authentication endpoints
@app.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user.password)
    
    # Get package
    package = db.query(Package).filter(Package.name.ilike(user.selected_package)).first()
    if not package:
        package = db.query(Package).filter(Package.name == "Standard").first()
    
    # Create new user
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        phone_number=user.phone_number,
        password_hash=hashed_password,
        package_id=package.id if package else None
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.post("/auth/login", response_model=Token)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    # Authenticate user
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": db_user.email})
    
    # Store session
    from datetime import datetime, timedelta
    expires_at = datetime.utcnow() + timedelta(days=30)  # 30 days expiry
    
    session = UserSession(
        user_id=db_user.id,
        session_token=access_token,
        expires_at=expires_at
    )
    db.add(session)
    db.commit()
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

# Package endpoints
@app.get("/packages", response_model=List[PackageResponse])
async def get_packages(db: Session = Depends(get_db)):
    packages = db.query(Package).all()
    return packages

# Camera endpoints
@app.get("/cameras", response_model=List[CameraResponse])
async def get_cameras(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cameras = db.query(Camera).filter(Camera.user_id == current_user.id).all()
    return cameras

@app.post("/cameras", response_model=CameraResponse)
async def create_camera(
    camera: CameraCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check camera limit based on package
    user_cameras = db.query(Camera).filter(Camera.user_id == current_user.id).count()
    if current_user.package and current_user.package.camera_limit != -1:
        if user_cameras >= current_user.package.camera_limit:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Camera limit reached. Your package allows {current_user.package.camera_limit} cameras."
            )
    
    # Hash camera password if provided
    password_hash = None
    if camera.password:
        password_hash = get_password_hash(camera.password)
    
    db_camera = Camera(
        user_id=current_user.id,
        camera_name=camera.camera_name,
        camera_brand=camera.camera_brand,
        camera_type=camera.camera_type,
        ip_address=camera.ip_address,
        port=camera.port,
        username=camera.username,
        password_hash=password_hash,
        status="inactive"
    )
    
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    
    return db_camera

@app.put("/cameras/{camera_id}", response_model=CameraResponse)
async def update_camera(
    camera_id: int,
    camera: CameraUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_camera = db.query(Camera).filter(
        Camera.id == camera_id,
        Camera.user_id == current_user.id
    ).first()
    
    if not db_camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Camera not found"
        )
    
    # Update camera fields
    for field, value in camera.dict(exclude_unset=True).items():
        if field == "password" and value:
            setattr(db_camera, "password_hash", get_password_hash(value))
        else:
            setattr(db_camera, field, value)
    
    db.commit()
    db.refresh(db_camera)
    
    return db_camera

@app.delete("/cameras/{camera_id}")
async def delete_camera(
    camera_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_camera = db.query(Camera).filter(
        Camera.id == camera_id,
        Camera.user_id == current_user.id
    ).first()
    
    if not db_camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Camera not found"
        )
    
    db.delete(db_camera)
    db.commit()
    
    return {"message": "Camera deleted successfully"}

# Face endpoints
@app.get("/faces", response_model=List[FaceResponse])
async def get_faces(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    faces = db.query(RegisteredFace).filter(RegisteredFace.user_id == current_user.id).all()
    return faces

@app.post("/faces", response_model=FaceResponse)
async def create_face(
    face_name: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check face limit based on package
    user_faces = db.query(RegisteredFace).filter(RegisteredFace.user_id == current_user.id).count()
    if current_user.package and current_user.package.max_registered_faces != -1:
        if user_faces >= current_user.package.max_registered_faces:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Face limit reached. Your package allows {current_user.package.max_registered_faces} faces."
            )
    
    # Save uploaded file
    file_path = f"uploads/faces/{current_user.id}_{face_name}_{file.filename}"
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # TODO: Process face encoding here using face_recognition library
    
    db_face = RegisteredFace(
        user_id=current_user.id,
        face_name=face_name,
        face_image_path=file_path
    )
    
    db.add(db_face)
    db.commit()
    db.refresh(db_face)
    
    return db_face

@app.delete("/faces/{face_id}")
async def delete_face(
    face_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_face = db.query(RegisteredFace).filter(
        RegisteredFace.id == face_id,
        RegisteredFace.user_id == current_user.id
    ).first()
    
    if not db_face:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Face not found"
        )
    
    # Delete image file
    if db_face.face_image_path and os.path.exists(db_face.face_image_path):
        os.remove(db_face.face_image_path)
    
    db.delete(db_face)
    db.commit()
    
    return {"message": "Face deleted successfully"}

# Detection log endpoints
@app.get("/detections", response_model=List[DetectionLogResponse])
async def get_detections(
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    detections = db.query(DetectionLog).options(
        joinedload(DetectionLog.camera),
        joinedload(DetectionLog.registered_face)
    ).filter(
        DetectionLog.user_id == current_user.id
    ).order_by(DetectionLog.detected_at.desc()).offset(offset).limit(limit).all()
    
    # Convert related objects to dictionaries
    result = []
    for detection in detections:
        detection_dict = {
            "id": detection.id,
            "camera_id": detection.camera_id,
            "registered_face_id": detection.registered_face_id,
            "detection_confidence": detection.detection_confidence,
            "detection_image_path": detection.detection_image_path,
            "detected_at": detection.detected_at,
            "created_at": detection.created_at,
            "camera": {
                "id": detection.camera.id,
                "camera_name": detection.camera.camera_name,
                "camera_brand": detection.camera.camera_brand,
                "camera_type": detection.camera.camera_type,
            } if detection.camera else None,
            "registered_face": {
                "id": detection.registered_face.id,
                "face_name": detection.registered_face.face_name,
                "face_image_path": detection.registered_face.face_image_path,
            } if detection.registered_face else None
        }
        result.append(detection_dict)
    
    return result

# Dashboard stats endpoint
@app.get("/dashboard/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from datetime import datetime, timedelta
    
    today = datetime.now().date()
    
    # Get today's alerts count
    today_alerts = db.query(DetectionLog).filter(
        DetectionLog.user_id == current_user.id,
        DetectionLog.detected_at >= today
    ).count()
    
    # Get total registered faces
    total_faces = db.query(RegisteredFace).filter(
        RegisteredFace.user_id == current_user.id,
        RegisteredFace.is_active == True
    ).count()
    
    return {
        "total_alerts_today": f"{today_alerts:02d}",
        "total_registered_faces": f"{total_faces:02d}"
    }

# Test camera connection endpoint
@app.post("/cameras/{camera_id}/test")
async def test_camera_connection(
    camera_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_camera = db.query(Camera).filter(
        Camera.id == camera_id,
        Camera.user_id == current_user.id
    ).first()
    
    if not db_camera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Camera not found"
        )
    
    # TODO: Implement actual camera connection testing
    # For now, return success
    return {"status": "success", "message": "Camera connection test successful"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)