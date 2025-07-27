from datetime import datetime
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging

logger = logging.getLogger(__name__)

class DatabaseService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db

    # Portfolio operations
    async def get_portfolio_items(self, category: Optional[str] = None, featured: Optional[bool] = None):
        query = {}
        if category and category != "All":
            query["category"] = category
        if featured is not None:
            query["featured"] = featured
        
        cursor = self.db.portfolio.find(query, {"_id": 0}).sort("order", 1)
        items = await cursor.to_list(length=None)
        return items

    async def create_portfolio_item(self, item_data: dict):
        item_data["created_at"] = datetime.utcnow()
        item_data["updated_at"] = datetime.utcnow()
        result = await self.db.portfolio.insert_one(item_data)
        return result.inserted_id

    async def update_portfolio_item(self, item_id: str, update_data: dict):
        update_data["updated_at"] = datetime.utcnow()
        result = await self.db.portfolio.update_one(
            {"id": item_id}, 
            {"$set": update_data}
        )
        return result.modified_count > 0

    async def delete_portfolio_item(self, item_id: str):
        result = await self.db.portfolio.delete_one({"id": item_id})
        return result.deleted_count > 0

    # Services operations
    async def get_services(self, active_only: bool = True):
        query = {"active": True} if active_only else {}
        cursor = self.db.services.find(query, {"_id": 0}).sort("order", 1)
        services = await cursor.to_list(length=None)
        return services

    async def create_service(self, service_data: dict):
        service_data["created_at"] = datetime.utcnow()
        service_data["updated_at"] = datetime.utcnow()
        result = await self.db.services.insert_one(service_data)
        return result.inserted_id

    async def update_service(self, service_id: str, update_data: dict):
        update_data["updated_at"] = datetime.utcnow()
        result = await self.db.services.update_one(
            {"id": service_id}, 
            {"$set": update_data}
        )
        return result.modified_count > 0

    async def delete_service(self, service_id: str):
        result = await self.db.services.delete_one({"id": service_id})
        return result.deleted_count > 0

    # Testimonials operations
    async def get_testimonials(self, approved_only: bool = True, featured: Optional[bool] = None):
        query = {}
        if approved_only:
            query["approved"] = True
        if featured is not None:
            query["featured"] = featured
        
        cursor = self.db.testimonials.find(query, {"_id": 0}).sort("created_at", -1)
        testimonials = await cursor.to_list(length=None)
        return testimonials

    async def create_testimonial(self, testimonial_data: dict):
        testimonial_data["created_at"] = datetime.utcnow()
        testimonial_data["updated_at"] = datetime.utcnow()
        result = await self.db.testimonials.insert_one(testimonial_data)
        return result.inserted_id

    async def update_testimonial(self, testimonial_id: str, update_data: dict):
        update_data["updated_at"] = datetime.utcnow()
        result = await self.db.testimonials.update_one(
            {"id": testimonial_id}, 
            {"$set": update_data}
        )
        return result.modified_count > 0

    async def delete_testimonial(self, testimonial_id: str):
        result = await self.db.testimonials.delete_one({"id": testimonial_id})
        return result.deleted_count > 0

    # Contact & Booking operations
    async def create_contact_message(self, message_data: dict):
        message_data["created_at"] = datetime.utcnow()
        message_data["updated_at"] = datetime.utcnow()
        result = await self.db.contact_messages.insert_one(message_data)
        return result.inserted_id

    async def get_contact_messages(self, status: Optional[str] = None):
        query = {}
        if status:
            query["status"] = status
        
        cursor = self.db.contact_messages.find(query).sort("created_at", -1)
        messages = await cursor.to_list(length=None)
        return messages

    async def update_message_status(self, message_id: str, status: str):
        result = await self.db.contact_messages.update_one(
            {"id": message_id},
            {"$set": {"status": status, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0

    async def create_booking_request(self, booking_data: dict):
        booking_data["created_at"] = datetime.utcnow()
        booking_data["updated_at"] = datetime.utcnow()
        result = await self.db.booking_requests.insert_one(booking_data)
        return result.inserted_id

    async def get_booking_requests(self, status: Optional[str] = None):
        query = {}
        if status:
            query["status"] = status
        
        cursor = self.db.booking_requests.find(query).sort("created_at", -1)
        bookings = await cursor.to_list(length=None)
        return bookings

    async def update_booking_status(self, booking_id: str, status: str):
        result = await self.db.booking_requests.update_one(
            {"id": booking_id},
            {"$set": {"status": status, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0

    # Settings operations
    async def get_all_settings(self):
        cursor = self.db.settings.find({})
        settings = await cursor.to_list(length=None)
        return {setting["key"]: setting["value"] for setting in settings}

    async def get_setting(self, key: str):
        setting = await self.db.settings.find_one({"key": key})
        return setting["value"] if setting else None

    async def update_setting(self, key: str, value: dict):
        result = await self.db.settings.update_one(
            {"key": key},
            {
                "$set": {
                    "value": value,
                    "updated_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        return True


# Data seeding function
async def seed_initial_data(db_service: DatabaseService):
    """Seed the database with initial data from mock.js"""
    
    # Check if data already exists
    existing_portfolio = await db_service.get_portfolio_items()
    if existing_portfolio:
        logger.info("Database already seeded, skipping...")
        return

    logger.info("Seeding database with initial data...")

    # Portfolio data
    portfolio_items = [
        {
            "id": "1",
            "title": "בר מצווה של דניאל",
            "title_en": "Daniel's Bar Mitzvah",
            "category": "Bar Mitzvah",
            "image": "https://images.unsplash.com/photo-1658889849723-0191c8ac8c61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwyfHxCYXIlMjBNaXR6dmFofGVufDB8fHx8MTc1MzY1MDEwNHww&ixlib=rb-4.1.0&q=85",
            "description": "חגיגה משפחתית מרגשת בכותל המערבי",
            "featured": True,
            "order": 1
        },
        {
            "id": "2",
            "title": "ברית מילה של אברהם",
            "title_en": "Abraham's Brit Milah",
            "category": "Brit Milah",
            "image": "https://images.unsplash.com/photo-1578154450695-aa2f8d2b10a2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxCYXIlMjBNaXR6dmFofGVufDB8fHx8MTc1MzY1MDEwNHww&ixlib=rb-4.1.0&q=85",
            "description": "רגעים קדושים בבוקר יפהפה",
            "featured": True,
            "order": 2
        },
        {
            "id": "3",
            "title": "בת מצווה של שרה",
            "title_en": "Sarah's Bat Mitzvah",
            "category": "Bat Mitzvah",
            "image": "https://images.unsplash.com/photo-1747128976434-625335086fb3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxKZXdpc2glMjBjZXJlbW9ueXxlbnwwfHx8fDE3NTM2NTAwOTh8MA&ixlib=rb-4.1.0&q=85",
            "description": "חגיגה אלגנטית עם המשפחה והחברים",
            "featured": False,
            "order": 3
        },
        {
            "id": "4",
            "title": "עלייה לתורה מיוחדת",
            "title_en": "Special Torah Reading",
            "category": "Torah Reading",
            "image": "https://images.unsplash.com/photo-1661919858163-6d56dc4bec97?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxUb3JhaCUyMHJlYWRpbmd8ZW58MHx8fHwxNzUzNjUwMTA4fDA&ixlib=rb-4.1.0&q=85",
            "description": "רגע קדוש של קריאה בתורה",
            "featured": True,
            "order": 4
        },
        {
            "id": "5",
            "title": "טקס דתי משפחתי",
            "title_en": "Family Religious Ceremony",
            "category": "Family Event",
            "image": "https://images.unsplash.com/photo-1649351340622-8092aa097b0f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxKZXdpc2glMjBjZXJlbW9ueXxlbnwwfHx8fDE3NTM2NTAwOTh8MA&ixlib=rb-4.1.0&q=85",
            "description": "אירוע משפחתי חם ומרגש",
            "featured": False,
            "order": 5
        },
        {
            "id": "6",
            "title": "חגיגת בר מצווה בירושלים",
            "title_en": "Bar Mitzvah Celebration in Jerusalem",
            "category": "Bar Mitzvah",
            "image": "https://images.unsplash.com/photo-1549575483-5ed15f0353b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwzfHxCYXIlMjBNaXR6dmFofGVufDB8fHx8MTc1MzY1MDEwNHww&ixlib=rb-4.1.0&q=85",
            "description": "אב ובן ברגע מיוחד בכותל המערבי",
            "featured": True,
            "order": 6
        }
    ]

    for item in portfolio_items:
        await db_service.create_portfolio_item(item)

    # Services data
    services = [
        {
            "id": "1",
            "name": "בר/בת מצווה",
            "name_en": "Bar/Bat Mitzvah",
            "description": "צילום מקצועי של יום מיוחד זה - מההכנות ועד לחגיגה",
            "description_en": "Professional photography of this special day - from preparations to celebration",
            "price": "₪2,500 - ₪4,500",
            "duration": "8 שעות צילום",
            "duration_en": "8 hours of photography",
            "includes": ["צילום הטקס בבית הכנסת", "צילום החגיגה", "עריכה מקצועית", "200+ תמונות ערוכות"],
            "active": True,
            "order": 1
        },
        {
            "id": "2",
            "name": "ברית מילה",
            "name_en": "Brit Milah",
            "description": "צילום עדין ומכבד של הטקס המיוחד",
            "description_en": "Gentle and respectful photography of this special ceremony",
            "price": "₪1,500 - ₪2,500",
            "duration": "4 שעות צילום",
            "duration_en": "4 hours of photography",
            "includes": ["צילום הטקס", "צילום המשפחה", "תמונות קבוצתיות", "100+ תמונות ערוכות"],
            "active": True,
            "order": 2
        },
        {
            "id": "3",
            "name": "עלייה לתורה",
            "name_en": "Torah Reading",
            "description": "צילום רגעים קדושים של קריאה בתורה",
            "description_en": "Capturing sacred moments of Torah reading",
            "price": "₪1,200 - ₪2,000",
            "duration": "3 שעות צילום",
            "duration_en": "3 hours of photography",
            "includes": ["צילום הטקס", "צילום משפחתי", "תמונות של הזכרון", "80+ תמונות ערוכות"],
            "active": True,
            "order": 3
        }
    ]

    for service in services:
        await db_service.create_service(service)

    # Testimonials data
    testimonials = [
        {
            "id": "1",
            "name": "משפחת כהן",
            "name_en": "Cohen Family",
            "event": "בר מצווה",
            "event_en": "Bar Mitzvah",
            "text": "ידידיה צילם את בר המצווה של הבן שלנו בצורה מקצועית ומרגשת. הוא ידע להיות בזמן הנכון במקום הנכון וללכוד את כל הרגעים המיוחדים",
            "text_en": "Yedidya photographed our son's Bar Mitzvah professionally and emotionally. He knew how to be at the right time in the right place and capture all the special moments",
            "rating": 5,
            "approved": True,
            "featured": True
        },
        {
            "id": "2",
            "name": "משפחת לוי",
            "name_en": "Levy Family",
            "event": "ברית מילה",
            "event_en": "Brit Milah",
            "text": "צילום עדין ומכבד של הברית. ידידיה הקפיד על כל הפרטים ונתן לנו זכרונות יפים לכל החיים",
            "text_en": "Gentle and respectful photography of the Brit. Yedidya paid attention to all the details and gave us beautiful memories for life",
            "rating": 5,
            "approved": True,
            "featured": True
        },
        {
            "id": "3",
            "name": "משפחת אברהם",
            "name_en": "Abraham Family",
            "event": "בת מצווה",
            "event_en": "Bat Mitzvah",
            "text": "השירות המקצועי והחמימות האישית של ידידיה עשו את היום עוד יותר מיוחד. התמונות יפות ומרגשות",
            "text_en": "Yedidya's professional service and personal warmth made the day even more special. The photos are beautiful and moving",
            "rating": 5,
            "approved": True,
            "featured": True
        }
    ]

    for testimonial in testimonials:
        await db_service.create_testimonial(testimonial)

    # Settings data
    photographer_info = {
        "name": "ידידיה מלכא",
        "name_en": "Yedidya Malka",
        "tagline": "צלם אירועים יהודיים מקצועי",
        "tagline_en": "Professional Jewish Event Photographer",
        "description": "מתמחה בצילום אירועי מחזור החיים היהודיים - בר/בת מצווה, בריתות, עליות לתורה ואירועים משפחתיים מיוחדים",
        "description_en": "Specializing in Jewish lifecycle event photography - Bar/Bat Mitzvah, Brit Milah, Torah readings, and special family celebrations",
        "experience": "15+ שנות ניסיון",
        "experience_en": "15+ Years Experience",
        "location": "ירושלים וסביבותיה",
        "location_en": "Jerusalem & Surroundings"
    }

    contact_info = {
        "phone": "050-123-4567",
        "email": "yedidya@jewishevents.co.il",
        "address": "ירושלים, ישראל",
        "address_en": "Jerusalem, Israel"
    }

    social_media = {
        "instagram": "@yedidya_photography",
        "facebook": "YedidyaMalkaPhotography"
    }

    await db_service.update_setting("photographer_info", photographer_info)
    await db_service.update_setting("contact_info", contact_info)
    await db_service.update_setting("social_media", social_media)

    logger.info("Database seeded successfully!")