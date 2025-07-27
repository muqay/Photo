#!/usr/bin/env python3
"""
Backend API Testing for Jewish Event Photography Website
Tests all endpoints for functionality, Hebrew text handling, and data integrity
"""

import requests
import json
import sys
from datetime import datetime, timedelta
import os
from pathlib import Path

# Load environment variables
sys.path.append('/app/backend')
from dotenv import load_dotenv
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

class BackendTester:
    def __init__(self):
        self.results = {
            'passed': 0,
            'failed': 0,
            'errors': []
        }
        
    def log_result(self, test_name, success, message=""):
        if success:
            self.results['passed'] += 1
            print(f"✅ {test_name}: PASSED {message}")
        else:
            self.results['failed'] += 1
            self.results['errors'].append(f"{test_name}: {message}")
            print(f"❌ {test_name}: FAILED - {message}")
    
    def test_health_check(self):
        """Test basic API health check"""
        try:
            response = requests.get(f"{API_BASE}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "Jewish Event Photography API" in data.get("message", ""):
                    self.log_result("Health Check", True, "API is running")
                    return True
                else:
                    self.log_result("Health Check", False, "Unexpected response message")
            else:
                self.log_result("Health Check", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")
        return False
    
    def test_portfolio_endpoints(self):
        """Test portfolio-related endpoints"""
        print("\n=== Testing Portfolio Endpoints ===")
        
        # Test GET /api/portfolio
        try:
            response = requests.get(f"{API_BASE}/portfolio", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "data" in data:
                    portfolio_items = data["data"]
                    if len(portfolio_items) > 0:
                        # Check for Hebrew titles
                        hebrew_found = any("title" in item and any(ord(char) > 127 for char in item["title"]) 
                                         for item in portfolio_items)
                        if hebrew_found:
                            self.log_result("Portfolio GET", True, f"Retrieved {len(portfolio_items)} items with Hebrew text")
                        else:
                            self.log_result("Portfolio GET", False, "No Hebrew text found in portfolio items")
                    else:
                        self.log_result("Portfolio GET", False, "No portfolio items returned")
                else:
                    self.log_result("Portfolio GET", False, "Invalid response format")
            else:
                self.log_result("Portfolio GET", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Portfolio GET", False, f"Error: {str(e)}")
        
        # Test GET /api/portfolio/featured
        try:
            response = requests.get(f"{API_BASE}/portfolio/featured", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "data" in data:
                    featured_items = data["data"]
                    # Check if all returned items are featured
                    all_featured = all(item.get("featured", False) for item in featured_items)
                    if all_featured:
                        self.log_result("Portfolio Featured", True, f"Retrieved {len(featured_items)} featured items")
                    else:
                        self.log_result("Portfolio Featured", False, "Non-featured items in featured endpoint")
                else:
                    self.log_result("Portfolio Featured", False, "Invalid response format")
            else:
                self.log_result("Portfolio Featured", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Portfolio Featured", False, f"Error: {str(e)}")
        
        # Test category filtering
        categories = ["Bar Mitzvah", "Bat Mitzvah", "Brit Milah", "Torah Reading", "Family Event"]
        for category in categories:
            try:
                response = requests.get(f"{API_BASE}/portfolio", params={"category": category}, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success") and "data" in data:
                        items = data["data"]
                        # Check if all items match the category
                        correct_category = all(item.get("category") == category for item in items)
                        if correct_category:
                            self.log_result(f"Portfolio Filter ({category})", True, f"Retrieved {len(items)} items")
                        else:
                            self.log_result(f"Portfolio Filter ({category})", False, "Items don't match category filter")
                    else:
                        self.log_result(f"Portfolio Filter ({category})", False, "Invalid response format")
                else:
                    self.log_result(f"Portfolio Filter ({category})", False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_result(f"Portfolio Filter ({category})", False, f"Error: {str(e)}")
    
    def test_services_endpoints(self):
        """Test services-related endpoints"""
        print("\n=== Testing Services Endpoints ===")
        
        try:
            response = requests.get(f"{API_BASE}/services", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "data" in data:
                    services = data["data"]
                    if len(services) > 0:
                        # Check for Hebrew names and active services
                        hebrew_found = any("name" in service and any(ord(char) > 127 for char in service["name"]) 
                                         for service in services)
                        all_active = all(service.get("active", False) for service in services)
                        
                        if hebrew_found and all_active:
                            # Check for pricing information
                            has_pricing = all("price" in service for service in services)
                            if has_pricing:
                                self.log_result("Services GET", True, f"Retrieved {len(services)} active services with Hebrew names and pricing")
                            else:
                                self.log_result("Services GET", False, "Missing pricing information")
                        else:
                            issues = []
                            if not hebrew_found:
                                issues.append("no Hebrew text")
                            if not all_active:
                                issues.append("inactive services returned")
                            self.log_result("Services GET", False, f"Issues: {', '.join(issues)}")
                    else:
                        self.log_result("Services GET", False, "No services returned")
                else:
                    self.log_result("Services GET", False, "Invalid response format")
            else:
                self.log_result("Services GET", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Services GET", False, f"Error: {str(e)}")
    
    def test_testimonials_endpoints(self):
        """Test testimonials-related endpoints"""
        print("\n=== Testing Testimonials Endpoints ===")
        
        # Test GET /api/testimonials
        try:
            response = requests.get(f"{API_BASE}/testimonials", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "data" in data:
                    testimonials = data["data"]
                    if len(testimonials) > 0:
                        # Check for Hebrew text and approved status
                        hebrew_found = any("text" in testimonial and any(ord(char) > 127 for char in testimonial["text"]) 
                                         for testimonial in testimonials)
                        all_approved = all(testimonial.get("approved", False) for testimonial in testimonials)
                        
                        if hebrew_found and all_approved:
                            self.log_result("Testimonials GET", True, f"Retrieved {len(testimonials)} approved testimonials with Hebrew text")
                        else:
                            issues = []
                            if not hebrew_found:
                                issues.append("no Hebrew text")
                            if not all_approved:
                                issues.append("unapproved testimonials returned")
                            self.log_result("Testimonials GET", False, f"Issues: {', '.join(issues)}")
                    else:
                        self.log_result("Testimonials GET", False, "No testimonials returned")
                else:
                    self.log_result("Testimonials GET", False, "Invalid response format")
            else:
                self.log_result("Testimonials GET", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Testimonials GET", False, f"Error: {str(e)}")
        
        # Test GET /api/testimonials/featured
        try:
            response = requests.get(f"{API_BASE}/testimonials/featured", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "data" in data:
                    featured_testimonials = data["data"]
                    # Check if all returned testimonials are featured and approved
                    all_featured = all(testimonial.get("featured", False) for testimonial in featured_testimonials)
                    all_approved = all(testimonial.get("approved", False) for testimonial in featured_testimonials)
                    
                    if all_featured and all_approved:
                        self.log_result("Testimonials Featured", True, f"Retrieved {len(featured_testimonials)} featured testimonials")
                    else:
                        issues = []
                        if not all_featured:
                            issues.append("non-featured testimonials returned")
                        if not all_approved:
                            issues.append("unapproved testimonials returned")
                        self.log_result("Testimonials Featured", False, f"Issues: {', '.join(issues)}")
                else:
                    self.log_result("Testimonials Featured", False, "Invalid response format")
            else:
                self.log_result("Testimonials Featured", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Testimonials Featured", False, f"Error: {str(e)}")
    
    def test_contact_booking_endpoints(self):
        """Test contact and booking endpoints"""
        print("\n=== Testing Contact & Booking Endpoints ===")
        
        # Test POST /api/contact with Hebrew text
        contact_data = {
            "name": "משה כהן",
            "phone": "050-123-4567",
            "email": "moshe@example.com",
            "event_type": "בר מצווה",
            "event_date": (datetime.now() + timedelta(days=30)).isoformat(),
            "message": "שלום, אני מעוניין בצילום בר מצווה לבני. האירוע יתקיים בירושלים."
        }
        
        try:
            response = requests.post(f"{API_BASE}/contact", 
                                   json=contact_data, 
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "message" in data:
                    # Check if response message is in Hebrew
                    response_message = data["message"]
                    hebrew_response = any(ord(char) > 127 for char in response_message)
                    if hebrew_response:
                        self.log_result("Contact POST", True, "Contact message submitted with Hebrew response")
                    else:
                        self.log_result("Contact POST", False, "Response not in Hebrew")
                else:
                    self.log_result("Contact POST", False, "Invalid response format")
            else:
                self.log_result("Contact POST", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Contact POST", False, f"Error: {str(e)}")
        
        # Test POST /api/booking with Hebrew text
        booking_data = {
            "name": "רחל לוי",
            "phone": "052-987-6543",
            "email": "rachel@example.com",
            "event_type": "בת מצווה",
            "event_date": (datetime.now() + timedelta(days=45)).isoformat(),
            "guest_count": 80,
            "budget": "₪3,000 - ₪4,000",
            "venue": "בית כנסת הגדול, ירושלים",
            "additional_info": "נרצה צילום גם של ההכנות לפני הטקס"
        }
        
        try:
            response = requests.post(f"{API_BASE}/booking", 
                                   json=booking_data, 
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "message" in data:
                    # Check if response message is in Hebrew
                    response_message = data["message"]
                    hebrew_response = any(ord(char) > 127 for char in response_message)
                    if hebrew_response:
                        self.log_result("Booking POST", True, "Booking request submitted with Hebrew response")
                    else:
                        self.log_result("Booking POST", False, "Response not in Hebrew")
                else:
                    self.log_result("Booking POST", False, "Invalid response format")
            else:
                self.log_result("Booking POST", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Booking POST", False, f"Error: {str(e)}")
    
    def test_settings_endpoints(self):
        """Test settings-related endpoints"""
        print("\n=== Testing Settings Endpoints ===")
        
        # Test GET /api/settings
        try:
            response = requests.get(f"{API_BASE}/settings", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "data" in data:
                    settings = data["data"]
                    
                    # Check for required settings
                    required_settings = ["photographer_info", "contact_info", "social_media"]
                    missing_settings = [setting for setting in required_settings if setting not in settings]
                    
                    if not missing_settings:
                        # Check for photographer name "ידידיה מלכא"
                        photographer_info = settings.get("photographer_info", {})
                        photographer_name = photographer_info.get("name", "")
                        
                        if "ידידיה מלכא" in photographer_name:
                            self.log_result("Settings GET", True, "All settings retrieved with correct photographer name")
                        else:
                            self.log_result("Settings GET", False, f"Photographer name incorrect: {photographer_name}")
                    else:
                        self.log_result("Settings GET", False, f"Missing settings: {', '.join(missing_settings)}")
                else:
                    self.log_result("Settings GET", False, "Invalid response format")
            else:
                self.log_result("Settings GET", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Settings GET", False, f"Error: {str(e)}")
        
        # Test individual setting retrieval
        setting_keys = ["photographer_info", "contact_info", "social_media"]
        for key in setting_keys:
            try:
                response = requests.get(f"{API_BASE}/settings/{key}", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success") and "data" in data:
                        self.log_result(f"Settings GET ({key})", True, "Individual setting retrieved")
                    else:
                        self.log_result(f"Settings GET ({key})", False, "Invalid response format")
                else:
                    self.log_result(f"Settings GET ({key})", False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_result(f"Settings GET ({key})", False, f"Error: {str(e)}")
    
    def test_database_integration(self):
        """Test database integration and Hebrew text encoding"""
        print("\n=== Testing Database Integration ===")
        
        # Test Hebrew text encoding by checking portfolio items
        try:
            response = requests.get(f"{API_BASE}/portfolio", timeout=10)
            if response.status_code == 200:
                data = response.json()
                portfolio_items = data.get("data", [])
                
                # Check for specific Hebrew titles from seeded data
                expected_titles = ["בר מצווה של דניאל", "ברית מילה של אברהם", "בת מצווה של שרה"]
                found_titles = [item.get("title", "") for item in portfolio_items]
                
                hebrew_titles_found = any(title in found_titles for title in expected_titles)
                
                if hebrew_titles_found:
                    self.log_result("Database Hebrew Encoding", True, "Hebrew text properly encoded and retrieved")
                else:
                    self.log_result("Database Hebrew Encoding", False, "Expected Hebrew titles not found")
                
                # Check document structure
                if portfolio_items:
                    sample_item = portfolio_items[0]
                    required_fields = ["id", "title", "category", "image", "description", "featured"]
                    missing_fields = [field for field in required_fields if field not in sample_item]
                    
                    if not missing_fields:
                        self.log_result("Database Document Structure", True, "Portfolio documents have correct structure")
                    else:
                        self.log_result("Database Document Structure", False, f"Missing fields: {', '.join(missing_fields)}")
                else:
                    self.log_result("Database Document Structure", False, "No portfolio items to check structure")
            else:
                self.log_result("Database Hebrew Encoding", False, f"Failed to retrieve portfolio: {response.status_code}")
        except Exception as e:
            self.log_result("Database Hebrew Encoding", False, f"Error: {str(e)}")
        
        # Verify photographer name in settings
        try:
            response = requests.get(f"{API_BASE}/settings/photographer_info", timeout=10)
            if response.status_code == 200:
                data = response.json()
                photographer_info = data.get("data", {})
                photographer_name = photographer_info.get("name", "")
                
                if photographer_name == "ידידיה מלכא":
                    self.log_result("Database Photographer Name", True, "Photographer name correctly stored and retrieved")
                else:
                    self.log_result("Database Photographer Name", False, f"Expected 'ידידיה מלכא', got '{photographer_name}'")
            else:
                self.log_result("Database Photographer Name", False, f"Failed to retrieve photographer info: {response.status_code}")
        except Exception as e:
            self.log_result("Database Photographer Name", False, f"Error: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print(f"🚀 Starting Backend API Tests for Jewish Event Photography Website")
        print(f"📍 Testing API at: {API_BASE}")
        print("=" * 80)
        
        # Start with health check
        if not self.test_health_check():
            print("\n❌ Health check failed. Stopping tests.")
            return self.results
        
        # Run all test suites
        self.test_portfolio_endpoints()
        self.test_services_endpoints()
        self.test_testimonials_endpoints()
        self.test_contact_booking_endpoints()
        self.test_settings_endpoints()
        self.test_database_integration()
        
        # Print summary
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        print(f"✅ Passed: {self.results['passed']}")
        print(f"❌ Failed: {self.results['failed']}")
        print(f"📈 Success Rate: {(self.results['passed'] / (self.results['passed'] + self.results['failed']) * 100):.1f}%")
        
        if self.results['errors']:
            print("\n🔍 FAILED TESTS:")
            for error in self.results['errors']:
                print(f"   • {error}")
        
        return self.results

if __name__ == "__main__":
    tester = BackendTester()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if results['failed'] == 0 else 1)