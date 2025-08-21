from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, CheckConstraint, LargeBinary, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB, INET
from datetime import datetime
from database import Base

class Package(Base):
    __tablename__ = "packages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    period = Column(String(20), nullable=False, default="monthly")
    description = Column(Text)
    features = Column(JSONB)
    camera_limit = Column(Integer)
    max_registered_faces = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    users = relationship("User", back_populates="package")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(20))
    password_hash = Column(String(255), nullable=False)
    package_id = Column(Integer, ForeignKey("packages.id"))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    package = relationship("Package", back_populates="users")
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    cameras = relationship("Camera", back_populates="user", cascade="all, delete-orphan")
    registered_faces = relationship("RegisteredFace", back_populates="user", cascade="all, delete-orphan")
    detection_logs = relationship("DetectionLog", back_populates="user", cascade="all, delete-orphan")

class UserSession(Base):
    __tablename__ = "user_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_token = Column(String(255), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="sessions")

class Camera(Base):
    __tablename__ = "cameras"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    camera_name = Column(String(255), nullable=False)
    camera_brand = Column(String(100))
    camera_type = Column(String(20), nullable=False)
    ip_address = Column(INET)
    port = Column(Integer)
    username = Column(String(255))
    password_hash = Column(String(255))
    status = Column(String(20), default="inactive")
    last_seen = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        CheckConstraint("camera_type IN ('ip_camera', 'webcam')", name='check_camera_type'),
        CheckConstraint("status IN ('active', 'inactive', 'disabled')", name='check_camera_status'),
        CheckConstraint("port >= 1 AND port <= 65535", name='check_port_range'),
        CheckConstraint(
            "(camera_type = 'webcam') OR (camera_type = 'ip_camera' AND ip_address IS NOT NULL AND port IS NOT NULL)",
            name='check_ip_camera_requirements'
        ),
    )
    
    # Relationships
    user = relationship("User", back_populates="cameras")
    detection_logs = relationship("DetectionLog", back_populates="camera", cascade="all, delete-orphan")

class RegisteredFace(Base):
    __tablename__ = "registered_faces"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    face_name = Column(String(255), nullable=False, index=True)
    face_image_path = Column(String(500))
    face_encoding = Column(LargeBinary)  # Store face encoding for recognition
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="registered_faces")
    detection_logs = relationship("DetectionLog", back_populates="registered_face")

class DetectionLog(Base):
    __tablename__ = "detection_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    camera_id = Column(Integer, ForeignKey("cameras.id", ondelete="CASCADE"), nullable=False)
    registered_face_id = Column(Integer, ForeignKey("registered_faces.id", ondelete="SET NULL"))
    detection_confidence = Column(Numeric(5, 4))
    detection_image_path = Column(String(500))
    detected_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="detection_logs")
    camera = relationship("Camera", back_populates="detection_logs")
    registered_face = relationship("RegisteredFace", back_populates="detection_logs")