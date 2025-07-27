from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
import logging
from pathlib import Path
from typing import Optional, List

# Import our models and database service
from models import *
from database import DatabaseService, seed_initial_data

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
db_service = DatabaseService(db)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Utility function to parse date strings
def parse_date_string(date_str: Optional[str]) -> Optional[datetime]:
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    except (ValueError, AttributeError):
        return None


# Portfolio endpoints
@api_router.get("/portfolio")
async def get_portfolio(category: Optional[str] = None):
    try:
        items = await db_service.get_portfolio_items(category=category)
        return {"success": True, "data": items}
    except Exception as e:
        logger.error(f"Error fetching portfolio: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch portfolio items")

@api_router.get("/portfolio/featured")
async def get_featured_portfolio():
    try:
        items = await db_service.get_portfolio_items(featured=True)
        return {"success": True, "data": items}
    except Exception as e:
        logger.error(f"Error fetching featured portfolio: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch featured portfolio items")

@api_router.post("/portfolio")
async def create_portfolio_item(item: PortfolioItemCreate):
    try:
        item_dict = item.dict()
        item_id = await db_service.create_portfolio_item(item_dict)
        return {"success": True, "message": "Portfolio item created successfully", "id": str(item_id)}
    except Exception as e:
        logger.error(f"Error creating portfolio item: {e}")
        raise HTTPException(status_code=500, detail="Failed to create portfolio item")

@api_router.put("/portfolio/{item_id}")
async def update_portfolio_item(item_id: str, item: PortfolioItemUpdate):
    try:
        update_dict = {k: v for k, v in item.dict().items() if v is not None}
        if not update_dict:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        success = await db_service.update_portfolio_item(item_id, update_dict)
        if not success:
            raise HTTPException(status_code=404, detail="Portfolio item not found")
        
        return {"success": True, "message": "Portfolio item updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating portfolio item: {e}")
        raise HTTPException(status_code=500, detail="Failed to update portfolio item")

@api_router.delete("/portfolio/{item_id}")
async def delete_portfolio_item(item_id: str):
    try:
        success = await db_service.delete_portfolio_item(item_id)
        if not success:
            raise HTTPException(status_code=404, detail="Portfolio item not found")
        
        return {"success": True, "message": "Portfolio item deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting portfolio item: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete portfolio item")


# Services endpoints
@api_router.get("/services")
async def get_services():
    try:
        services = await db_service.get_services(active_only=True)
        return {"success": True, "data": services}
    except Exception as e:
        logger.error(f"Error fetching services: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch services")

@api_router.post("/services")
async def create_service(service: ServiceCreate):
    try:
        service_dict = service.dict()
        service_id = await db_service.create_service(service_dict)
        return {"success": True, "message": "Service created successfully", "id": str(service_id)}
    except Exception as e:
        logger.error(f"Error creating service: {e}")
        raise HTTPException(status_code=500, detail="Failed to create service")

@api_router.put("/services/{service_id}")
async def update_service(service_id: str, service: ServiceUpdate):
    try:
        update_dict = {k: v for k, v in service.dict().items() if v is not None}
        if not update_dict:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        success = await db_service.update_service(service_id, update_dict)
        if not success:
            raise HTTPException(status_code=404, detail="Service not found")
        
        return {"success": True, "message": "Service updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating service: {e}")
        raise HTTPException(status_code=500, detail="Failed to update service")

@api_router.delete("/services/{service_id}")
async def delete_service(service_id: str):
    try:
        success = await db_service.delete_service(service_id)
        if not success:
            raise HTTPException(status_code=404, detail="Service not found")
        
        return {"success": True, "message": "Service deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting service: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete service")


# Testimonials endpoints
@api_router.get("/testimonials")
async def get_testimonials():
    try:
        testimonials = await db_service.get_testimonials(approved_only=True)
        return {"success": True, "data": testimonials}
    except Exception as e:
        logger.error(f"Error fetching testimonials: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch testimonials")

@api_router.get("/testimonials/featured")
async def get_featured_testimonials():
    try:
        testimonials = await db_service.get_testimonials(approved_only=True, featured=True)
        return {"success": True, "data": testimonials}
    except Exception as e:
        logger.error(f"Error fetching featured testimonials: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch featured testimonials")

@api_router.post("/testimonials")
async def create_testimonial(testimonial: TestimonialCreate):
    try:
        testimonial_dict = testimonial.dict()
        testimonial_id = await db_service.create_testimonial(testimonial_dict)
        return {"success": True, "message": "Testimonial created successfully", "id": str(testimonial_id)}
    except Exception as e:
        logger.error(f"Error creating testimonial: {e}")
        raise HTTPException(status_code=500, detail="Failed to create testimonial")

@api_router.put("/testimonials/{testimonial_id}")
async def update_testimonial(testimonial_id: str, testimonial: TestimonialUpdate):
    try:
        update_dict = {k: v for k, v in testimonial.dict().items() if v is not None}
        if not update_dict:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        success = await db_service.update_testimonial(testimonial_id, update_dict)
        if not success:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        return {"success": True, "message": "Testimonial updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating testimonial: {e}")
        raise HTTPException(status_code=500, detail="Failed to update testimonial")

@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str):
    try:
        success = await db_service.delete_testimonial(testimonial_id)
        if not success:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        return {"success": True, "message": "Testimonial deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting testimonial: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete testimonial")


# Contact & Booking endpoints
@api_router.post("/contact")
async def submit_contact_message(message: ContactMessageCreate):
    try:
        message_dict = message.dict()
        # Parse event_date if provided
        if message_dict.get("event_date"):
            message_dict["event_date"] = parse_date_string(message_dict["event_date"])
        
        message_id = await db_service.create_contact_message(message_dict)
        return {"success": True, "message": "הודעתך נשלחה בהצלחה!", "id": str(message_id)}
    except Exception as e:
        logger.error(f"Error submitting contact message: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit contact message")

@api_router.post("/booking")
async def submit_booking_request(booking: BookingRequestCreate):
    try:
        booking_dict = booking.dict()
        # Parse event_date
        booking_dict["event_date"] = parse_date_string(booking_dict["event_date"])
        if not booking_dict["event_date"]:
            raise HTTPException(status_code=400, detail="Valid event date is required")
        
        booking_id = await db_service.create_booking_request(booking_dict)
        return {"success": True, "message": "בקשת ההזמנה נשלחה בהצלחה!", "id": str(booking_id)}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error submitting booking request: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit booking request")

@api_router.get("/messages")
async def get_contact_messages(status: Optional[str] = None):
    try:
        messages = await db_service.get_contact_messages(status=status)
        return {"success": True, "data": messages}
    except Exception as e:
        logger.error(f"Error fetching contact messages: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch contact messages")

@api_router.put("/messages/{message_id}")
async def update_message_status(message_id: str, status_update: MessageStatusUpdate):
    try:
        success = await db_service.update_message_status(message_id, status_update.status)
        if not success:
            raise HTTPException(status_code=404, detail="Message not found")
        
        return {"success": True, "message": "Message status updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating message status: {e}")
        raise HTTPException(status_code=500, detail="Failed to update message status")

@api_router.get("/bookings")
async def get_booking_requests(status: Optional[str] = None):
    try:
        bookings = await db_service.get_booking_requests(status=status)
        return {"success": True, "data": bookings}
    except Exception as e:
        logger.error(f"Error fetching booking requests: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch booking requests")

@api_router.put("/bookings/{booking_id}")
async def update_booking_status(booking_id: str, status_update: BookingStatusUpdate):
    try:
        success = await db_service.update_booking_status(booking_id, status_update.status)
        if not success:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        return {"success": True, "message": "Booking status updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating booking status: {e}")
        raise HTTPException(status_code=500, detail="Failed to update booking status")


# Settings endpoints
@api_router.get("/settings")
async def get_all_settings():
    try:
        settings = await db_service.get_all_settings()
        return {"success": True, "data": settings}
    except Exception as e:
        logger.error(f"Error fetching settings: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch settings")

@api_router.get("/settings/{key}")
async def get_setting(key: str):
    try:
        setting = await db_service.get_setting(key)
        if setting is None:
            raise HTTPException(status_code=404, detail="Setting not found")
        
        return {"success": True, "data": setting}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching setting: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch setting")

@api_router.put("/settings/{key}")
async def update_setting(key: str, setting: SettingUpdate):
    try:
        await db_service.update_setting(key, setting.value)
        return {"success": True, "message": "Setting updated successfully"}
    except Exception as e:
        logger.error(f"Error updating setting: {e}")
        raise HTTPException(status_code=500, detail="Failed to update setting")


# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Jewish Event Photography API is running", "status": "healthy"}


# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    try:
        await seed_initial_data(db_service)
        logger.info("Application started successfully")
    except Exception as e:
        logger.error(f"Error during startup: {e}")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
