# API Contracts - Jewish Event Photography Website

## Overview
This document outlines the API contracts and integration plan for ידידיה מלכא's Jewish event photography website. The backend will replace mock data with real MongoDB storage and provide CRUD operations.

## Database Collections

### 1. Portfolio Collection (`portfolio`)
```javascript
{
  _id: ObjectId,
  title: String, // Hebrew title
  titleEn: String, // English title
  category: String, // "Bar Mitzvah", "Bat Mitzvah", "Brit Milah", "Torah Reading", "Family Event"
  image: String, // Image URL
  description: String, // Hebrew description
  descriptionEn: String, // English description
  featured: Boolean, // Whether to show in hero section
  order: Number, // Display order
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Services Collection (`services`)
```javascript
{
  _id: ObjectId,
  name: String, // Hebrew service name
  nameEn: String, // English service name
  description: String, // Hebrew description
  descriptionEn: String, // English description
  price: String, // Price range (e.g., "₪2,500 - ₪4,500")
  duration: String, // Hebrew duration
  durationEn: String, // English duration
  includes: [String], // Array of Hebrew included features
  includesEn: [String], // Array of English included features
  active: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Testimonials Collection (`testimonials`)
```javascript
{
  _id: ObjectId,
  name: String, // Hebrew client name
  nameEn: String, // English client name
  event: String, // Hebrew event type
  eventEn: String, // English event type
  text: String, // Hebrew testimonial text
  textEn: String, // English testimonial text
  rating: Number, // 1-5 stars
  approved: Boolean, // Admin approval
  featured: Boolean, // Show on homepage
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Contact Messages Collection (`contact_messages`)
```javascript
{
  _id: ObjectId,
  name: String,
  phone: String,
  email: String,
  eventType: String,
  eventDate: Date,
  message: String,
  status: String, // "new", "contacted", "closed"
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Booking Requests Collection (`booking_requests`)
```javascript
{
  _id: ObjectId,
  name: String,
  phone: String,
  email: String,
  eventType: String,
  eventDate: Date,
  guestCount: Number,
  budget: String,
  venue: String,
  additionalInfo: String,
  status: String, // "new", "quoted", "booked", "completed", "cancelled"
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Settings Collection (`settings`)
```javascript
{
  _id: ObjectId,
  key: String, // "photographer_info", "contact_info", "social_media"
  value: Object, // Flexible object for different settings
  updatedAt: Date
}
```

## API Endpoints

### Portfolio Endpoints
- `GET /api/portfolio` - Get all portfolio items with optional category filter
- `GET /api/portfolio/featured` - Get featured portfolio items for hero section
- `POST /api/portfolio` - Create new portfolio item (admin)
- `PUT /api/portfolio/:id` - Update portfolio item (admin)
- `DELETE /api/portfolio/:id` - Delete portfolio item (admin)

### Services Endpoints
- `GET /api/services` - Get all active services
- `POST /api/services` - Create new service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Testimonials Endpoints
- `GET /api/testimonials` - Get approved testimonials
- `GET /api/testimonials/featured` - Get featured testimonials
- `POST /api/testimonials` - Create new testimonial (admin)
- `PUT /api/testimonials/:id` - Update testimonial (admin)
- `DELETE /api/testimonials/:id` - Delete testimonial (admin)

### Contact & Booking Endpoints
- `POST /api/contact` - Submit contact message
- `POST /api/booking` - Submit booking request
- `GET /api/messages` - Get all contact messages (admin)
- `PUT /api/messages/:id` - Update message status (admin)
- `GET /api/bookings` - Get all booking requests (admin)
- `PUT /api/bookings/:id` - Update booking status (admin)

### Settings Endpoints
- `GET /api/settings` - Get all settings
- `GET /api/settings/:key` - Get specific setting
- `PUT /api/settings/:key` - Update setting (admin)

## Frontend Integration Plan

### 1. Remove Mock Data Dependencies
- Replace imports from `mock.js` with API calls
- Create API service layer (`src/services/api.js`)
- Add loading states and error handling

### 2. API Service Layer Structure
```javascript
// src/services/api.js
const API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const portfolioAPI = {
  getAll: (category) => axios.get(`${API_BASE}/portfolio`, { params: { category } }),
  getFeatured: () => axios.get(`${API_BASE}/portfolio/featured`)
};

export const servicesAPI = {
  getAll: () => axios.get(`${API_BASE}/services`)
};

export const testimonialsAPI = {
  getAll: () => axios.get(`${API_BASE}/testimonials`),
  getFeatured: () => axios.get(`${API_BASE}/testimonials/featured`)
};

export const contactAPI = {
  submitMessage: (data) => axios.post(`${API_BASE}/contact`, data),
  submitBooking: (data) => axios.post(`${API_BASE}/booking`, data)
};

export const settingsAPI = {
  getAll: () => axios.get(`${API_BASE}/settings`)
};
```

### 3. Component Updates Required
- **Hero.js**: Fetch featured portfolio items and photographer info
- **Portfolio.js**: Fetch portfolio items with category filtering
- **Services.js**: Fetch services from API
- **Testimonials.js**: Fetch approved testimonials
- **Contact.js**: Update form submissions to use API endpoints
- **Header.js** & **Footer.js**: Fetch photographer info and contact details

### 4. State Management
- Add loading states for API calls
- Implement error handling with user-friendly messages
- Add success feedback for form submissions
- Consider using React Query or SWR for data fetching (optional)

## Initial Data Seeding

The backend will be seeded with the current mock data translated to the database format, ensuring the website works immediately after integration.

## Error Handling Strategy

- Frontend: Toast notifications for success/error states
- Backend: Consistent error response format
- Validation: Both client-side and server-side validation
- Logging: Comprehensive logging for debugging

## Security Considerations

- Input validation and sanitization
- Rate limiting for contact forms
- CORS configuration
- Environment variable protection
- Basic admin authentication for management endpoints

## Performance Optimizations

- Image optimization and CDN considerations
- Database indexing for queries
- Caching for frequently accessed data
- Pagination for large datasets

This contract ensures a smooth transition from mock data to a fully functional backend while maintaining the existing user experience.