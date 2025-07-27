import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Send, Calendar } from 'lucide-react';
import { contactAPI, settingsAPI, handleAPIError } from '../services/api';
import { useToast } from '../hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeForm, setActiveForm] = useState('contact'); // 'contact' or 'booking'
  const [contactInfo, setContactInfo] = useState(null);
  const [socialMedia, setSocialMedia] = useState(null);
  
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    event_type: '',
    event_date: '',
    message: ''
  });

  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    event_type: '',
    event_date: '',
    guest_count: '',
    budget: '',
    venue: '',
    additional_info: ''
  });

  useEffect(() => {
    fetchContactSettings();
  }, []);

  const fetchContactSettings = async () => {
    try {
      const settingsResponse = await settingsAPI.getAll();
      const settings = settingsResponse.data || {};
      
      setContactInfo(settings.contact_info || {
        phone: "050-123-4567",
        email: "yedidya@jewishevents.co.il",
        address: "ירושלים, ישראל"
      });
      
      setSocialMedia(settings.social_media || {
        instagram: "@yedidya_photography",
        facebook: "YedidyaMalkaPhotography"
      });
    } catch (error) {
      console.error('Error fetching contact settings:', error);
      // Use fallback values
      setContactInfo({
        phone: "050-123-4567",
        email: "yedidya@jewishevents.co.il",
        address: "ירושלים, ישראל"
      });
      setSocialMedia({
        instagram: "@yedidya_photography",
        facebook: "YedidyaMalkaPhotography"
      });
    }
  };

  const eventTypes = [
    { value: 'bar-mitzvah', label: 'בר מצוה' },
    { value: 'bat-mitzvah', label: 'בת מצוה' },
    { value: 'brit-milah', label: 'ברית מילה' },
    { value: 'torah-reading', label: 'עלייה לתורה' },
    { value: 'save-the-date', label: 'סייב דה דייט' },
    { value: 'other', label: 'אחר' }
  ];

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleBookingChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await contactAPI.submitMessage(contactForm);
      toast({
        title: "הודעה נשלחה בהצלחה!",
        description: "אצור איתך קשר בהקדם האפשרי",
      });
      
      setContactForm({
        name: '',
        phone: '',
        email: '',
        event_type: '',
        event_date: '',
        message: ''
      });
    } catch (error) {
      const errorMessage = handleAPIError(error, 'שגיאה בשליחת ההודעה');
      toast({
        title: "שגיאה בשליחת ההודעה",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await contactAPI.submitBooking(bookingForm);
      toast({
        title: "בקשת הזמנה נשלחה!",
        description: "אחזור אליך תוך 24 שעות עם הצעת מחיר מפורטת",
      });
      
      setBookingForm({
        name: '',
        phone: '',
        email: '',
        event_type: '',
        event_date: '',
        guest_count: '',
        budget: '',
        venue: '',
        additional_info: ''
      });
    } catch (error) {
      const errorMessage = handleAPIError(error, 'שגיאה בשליחת הבקשה');
      toast({
        title: "שגיאה בשליחת הבקשה",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!contactInfo || !socialMedia) {
    return (
      <section id="contact" className="section-spacing">
        <div className="container-jewish">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-spacing">
      <div className="container-jewish">
        <div className="text-center mb-12">
          <h2 className="section-title hebrew-text">צור קשר</h2>
          <p className="body-text text-gray-600 max-w-2xl mx-auto hebrew-text">
            בואו נתכנן ביחד את הצילום המושלם לאירוע שלכם
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="hebrew-text text-right">
            <h3 className="photographer-name mb-8">פרטי התקשרות</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 justify-end">
                <div>
                  <p className="font-semibold text-gray-800">{contactInfo.phone}</p>
                  <p className="caption-text text-gray-600">זמין 24/7 לשיחות דחופות</p>
                </div>
                <Phone className="w-6 h-6 text-gray-500" />
              </div>

              <div className="flex items-center gap-4 justify-end">
                <div>
                  <p className="font-semibold text-gray-800">{contactInfo.email}</p>
                  <p className="caption-text text-gray-600">מענה תוך 2-4 שעות</p>
                </div>
                <Mail className="w-6 h-6 text-gray-500" />
              </div>

              <div className="flex items-center gap-4 justify-end">
                <div>
                  <p className="font-semibold text-gray-800">{contactInfo.address}</p>
                  <p className="caption-text text-gray-600">משרת את כל אזור המרכז</p>
                </div>
                <MapPin className="w-6 h-6 text-gray-500" />
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-12">
              <h4 className="font-semibold text-gray-800 mb-4">עקבו אחרי ברשתות החברתיות</h4>
              <div className="flex gap-4 justify-end">
                <a
                  href={`https://instagram.com/${socialMedia.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Instagram className="w-6 h-6 text-gray-600" />
                </a>
                <a
                  href={`https://facebook.com/${socialMedia.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Facebook className="w-6 h-6 text-gray-600" />
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="mt-12 bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4">שעות פעילות</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>ראשון - חמישי</span>
                  <span>09:00 - 22:00</span>
                </div>
                <div className="flex justify-between">
                  <span>שישי</span>
                  <span>09:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>שבת</span>
                  <span>מוצ"ש - 23:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Forms */}
          <div>
            {/* Form Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
              <button
                onClick={() => setActiveForm('contact')}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all hebrew-text ${
                  activeForm === 'contact'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Send className="w-4 h-4 inline ml-2" />
                שליחת הודעה
              </button>
              <button
                onClick={() => setActiveForm('booking')}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all hebrew-text ${
                  activeForm === 'booking'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Calendar className="w-4 h-4 inline ml-2" />
                בקשת הזמנה
              </button>
            </div>

            {/* Contact Form */}
            {activeForm === 'contact' && (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="hebrew-text text-right">
                  <div className="form-group">
                    <label className="form-label">שם מלא *</label>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      className="form-input"
                      required
                      dir="rtl"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">טלפון *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={contactForm.phone}
                        onChange={handleContactChange}
                        className="form-input"
                        required
                        dir="ltr"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">אימייל</label>
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        className="form-input"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">סוג האירוע</label>
                      <select
                        name="event_type"
                        value={contactForm.event_type}
                        onChange={handleContactChange}
                        className="form-input"
                        dir="rtl"
                      >
                        <option value="">בחר סוג אירוע</option>
                        {eventTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">תאריך האירוע</label>
                      <input
                        type="date"
                        name="event_date"
                        value={contactForm.event_date}
                        onChange={handleContactChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">הודעה</label>
                    <textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      rows={5}
                      className="form-input form-textarea"
                      placeholder="ספר לי על האירוע שלך..."
                      dir="rtl"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full justify-center"
                  >
                    {isSubmitting ? 'שולח...' : 'שלח הודעה'}
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}

            {/* Booking Form */}
            {activeForm === 'booking' && (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="hebrew-text text-right">
                  <div className="form-group">
                    <label className="form-label">שם מלא *</label>
                    <input
                      type="text"
                      name="name"
                      value={bookingForm.name}
                      onChange={handleBookingChange}
                      className="form-input"
                      required
                      dir="rtl"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">טלפון *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={bookingForm.phone}
                        onChange={handleBookingChange}
                        className="form-input"
                        required
                        dir="ltr"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">אימייל *</label>
                      <input
                        type="email"
                        name="email"
                        value={bookingForm.email}
                        onChange={handleBookingChange}
                        className="form-input"
                        required
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">סוג האירוע *</label>
                      <select
                        name="event_type"
                        value={bookingForm.event_type}
                        onChange={handleBookingChange}
                        className="form-input"
                        required
                        dir="rtl"
                      >
                        <option value="">בחר סוג אירוע</option>
                        {eventTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">תאריך האירוע *</label>
                      <input
                        type="date"
                        name="event_date"
                        value={bookingForm.event_date}
                        onChange={handleBookingChange}
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">מספר אורחים משוער</label>
                      <input
                        type="number"
                        name="guest_count"
                        value={bookingForm.guest_count}
                        onChange={handleBookingChange}
                        className="form-input"
                        placeholder="כמה אורחים?"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">תקציב משוער</label>
                      <select
                        name="budget"
                        value={bookingForm.budget}
                        onChange={handleBookingChange}
                        className="form-input"
                        dir="rtl"
                      >
                        <option value="">בחר טווח תקציב</option>
                        <option value="1000-2000">₪1,000 - ₪2,000</option>
                        <option value="2000-3500">₪2,000 - ₪3,500</option>
                        <option value="3500-5000">₪3,500 - ₪5,000</option>
                        <option value="5000+">₪5,000+</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">מקום האירוע</label>
                    <input
                      type="text"
                      name="venue"
                      value={bookingForm.venue}
                      onChange={handleBookingChange}
                      className="form-input"
                      placeholder="איפה יתקיים האירוע?"
                      dir="rtl"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">פרטים נוספים</label>
                    <textarea
                      name="additional_info"
                      value={bookingForm.additional_info}
                      onChange={handleBookingChange}
                      rows={4}
                      className="form-input form-textarea"
                      placeholder="ספר לי עוד על האירוע, צרכים מיוחדים, וכל דבר שחשוב לך..."
                      dir="rtl"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full justify-center"
                  >
                    {isSubmitting ? 'שולח בקשה...' : 'שלח בקשת הזמנה'}
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;