from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal

# Package schemas
class PackageResponse(BaseModel):
    id: int
    name: str
    price: Decimal
    period: str
    description: Optional[str]
    features: Optional[List[str]]
    camera_limit: Optional[int]
    max_registered_faces: Optional[int]
    
    class Config:
        from_attributes = True

# User schemas
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    phone_number: Optional[str]
    password: str
    confirm_password: str
    selected_package: str = "Standard"
    
    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('passwords do not match')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone_number: Optional[str]
    package_id: Optional[int]
    package: Optional[PackageResponse]
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Camera schemas
class CameraCreate(BaseModel):
    camera_name: str
    camera_brand: str
    camera_type: str  # "ip_camera" or "webcam"
    ip_address: Optional[str] = None
    port: Optional[int] = None
    username: Optional[str] = None
    password: Optional[str] = None
    
    @validator('camera_type')
    def validate_camera_type(cls, v):
        if v not in ['ip_camera', 'webcam']:
            raise ValueError('camera_type must be either ip_camera or webcam')
        return v
    
    @validator('port')
    def validate_port(cls, v):
        if v is not None and (v < 1 or v > 65535):
            raise ValueError('port must be between 1 and 65535')
        return v

class CameraUpdate(BaseModel):
    camera_name: Optional[str] = None
    camera_brand: Optional[str] = None
    camera_type: Optional[str] = None
    ip_address: Optional[str] = None
    port: Optional[int] = None
    username: Optional[str] = None
    password: Optional[str] = None
    status: Optional[str] = None
    
    @validator('camera_type')
    def validate_camera_type(cls, v):
        if v is not None and v not in ['ip_camera', 'webcam']:
            raise ValueError('camera_type must be either ip_camera or webcam')
        return v
    
    @validator('status')
    def validate_status(cls, v):
        if v is not None and v not in ['active', 'inactive', 'disabled']:
            raise ValueError('status must be active, inactive, or disabled')
        return v

class CameraResponse(BaseModel):
    id: int
    camera_name: str
    camera_brand: Optional[str]
    camera_type: str
    ip_address: Optional[str]
    port: Optional[int]
    username: Optional[str]
    status: str
    last_seen: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Face schemas
class FaceCreate(BaseModel):
    face_name: str

class FaceResponse(BaseModel):
    id: int
    face_name: str
    face_image_path: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Detection log schemas
class DetectionLogResponse(BaseModel):
    id: int
    camera_id: int
    registered_face_id: Optional[int]
    detection_confidence: Optional[Decimal]
    detection_image_path: Optional[str]
    detected_at: datetime
    created_at: datetime
    
    # Nested objects
    camera: Optional[Dict[str, Any]]
    registered_face: Optional[Dict[str, Any]]
    
    class Config:
        from_attributes = True