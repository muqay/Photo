from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid


# Portfolio Models
class PortfolioItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    title_en: Optional[str] = None
    category: str  # "Bar Mitzvah", "Bat Mitzvah", "Brit Milah", "Torah Reading", "Family Event"
    image: str
    description: str
    description_en: Optional[str] = None
    featured: bool = False
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PortfolioItemCreate(BaseModel):
    title: str
    title_en: Optional[str] = None
    category: str
    image: str
    description: str
    description_en: Optional[str] = None
    featured: bool = False
    order: int = 0

class PortfolioItemUpdate(BaseModel):
    title: Optional[str] = None
    title_en: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    description_en: Optional[str] = None
    featured: Optional[bool] = None
    order: Optional[int] = None


# Services Models
class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    name_en: Optional[str] = None
    description: str
    description_en: Optional[str] = None
    price: str
    duration: str
    duration_en: Optional[str] = None
    includes: List[str]
    includes_en: Optional[List[str]] = None
    active: bool = True
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ServiceCreate(BaseModel):
    name: str
    name_en: Optional[str] = None
    description: str
    description_en: Optional[str] = None
    price: str
    duration: str
    duration_en: Optional[str] = None
    includes: List[str]
    includes_en: Optional[List[str]] = None
    active: bool = True
    order: int = 0

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    name_en: Optional[str] = None
    description: Optional[str] = None
    description_en: Optional[str] = None
    price: Optional[str] = None
    duration: Optional[str] = None
    duration_en: Optional[str] = None
    includes: Optional[List[str]] = None
    includes_en: Optional[List[str]] = None
    active: Optional[bool] = None
    order: Optional[int] = None


# Testimonials Models
class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    name_en: Optional[str] = None
    event: str
    event_en: Optional[str] = None
    text: str
    text_en: Optional[str] = None
    rating: int = Field(ge=1, le=5)
    approved: bool = True
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TestimonialCreate(BaseModel):
    name: str
    name_en: Optional[str] = None
    event: str
    event_en: Optional[str] = None
    text: str
    text_en: Optional[str] = None
    rating: int = Field(ge=1, le=5)
    approved: bool = True
    featured: bool = False

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    name_en: Optional[str] = None
    event: Optional[str] = None
    event_en: Optional[str] = None
    text: Optional[str] = None
    text_en: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    approved: Optional[bool] = None
    featured: Optional[bool] = None


# Contact & Booking Models
class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    event_type: Optional[str] = None
    event_date: Optional[datetime] = None
    message: Optional[str] = None
    status: str = "new"  # "new", "contacted", "closed"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ContactMessageCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    event_type: Optional[str] = None
    event_date: Optional[str] = None  # Frontend sends as string
    message: Optional[str] = None

class BookingRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str
    event_type: str
    event_date: datetime
    guest_count: Optional[int] = None
    budget: Optional[str] = None
    venue: Optional[str] = None
    additional_info: Optional[str] = None
    status: str = "new"  # "new", "quoted", "booked", "completed", "cancelled"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BookingRequestCreate(BaseModel):
    name: str
    phone: str
    email: str
    event_type: str
    event_date: str  # Frontend sends as string
    guest_count: Optional[int] = None
    budget: Optional[str] = None
    venue: Optional[str] = None
    additional_info: Optional[str] = None

class MessageStatusUpdate(BaseModel):
    status: str

class BookingStatusUpdate(BaseModel):
    status: str


# Settings Models
class Setting(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    key: str
    value: Dict[str, Any]
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SettingCreate(BaseModel):
    key: str
    value: Dict[str, Any]

class SettingUpdate(BaseModel):
    value: Dict[str, Any]


# Response Models
class MessageResponse(BaseModel):
    success: bool
    message: str

class ErrorResponse(BaseModel):
    success: bool = False
    error: str