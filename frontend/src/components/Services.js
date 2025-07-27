import React, { useState, useEffect } from 'react';
import { Camera, Clock, CheckCircle, Star } from 'lucide-react';
import { servicesAPI, handleAPIError } from '../services/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicesAPI.getAll();
      setServices(response.data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(handleAPIError(err, 'Failed to load services'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="services" className="section-spacing">
        <div className="container-jewish">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="services-grid">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="service-card animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-6"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="section-spacing">
        <div className="container-jewish">
          <div className="text-center">
            <h2 className="section-title hebrew-text">השירותים שלי</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 hebrew-text">{error}</p>
              <button 
                onClick={fetchServices}
                className="btn-primary mt-4"
              >
                נסה שוב
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="section-spacing">
      <div className="container-jewish">
        <div className="text-center mb-12">
          <h2 className="section-title hebrew-text">השירותים שלי</h2>
          <p className="body-text text-gray-600 max-w-2xl mx-auto hebrew-text">
            צילום מקצועי לכל סוגי האירועים היהודיים במחירים הוגנים ושירות אישי
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="body-text text-gray-500 hebrew-text">
              אין שירותים זמינים כרגע
            </p>
          </div>
        ) : (
          <div className="services-grid">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="service-card animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="hebrew-text text-right">
                  <div className="flex items-center justify-between mb-4">
                    <Camera className="w-8 h-8 text-gray-400" />
                    <h3 className="photographer-name">{service.name}</h3>
                  </div>

                  <p className="body-text text-gray-600 mb-6">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="caption-text">{service.duration}</span>
                    </div>
                    <div className="text-left">
                      <span className="photographer-name text-gray-800">
                        {service.price}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {service.includes && service.includes.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 justify-end">
                        <span className="caption-text text-gray-600">{item}</span>
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      </div>
                    ))}
                  </div>

                  <button className="btn-primary w-full justify-center">
                    <Star className="w-5 h-5" />
                    בחר חבילה זו
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Package CTA */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8">
          <div className="hebrew-text">
            <h3 className="photographer-name mb-4">
              צריך משהו מיוחד?
            </h3>
            <p className="body-text text-gray-600 mb-6">
              אני מתאים חבילות צילום אישיות לכל לקוח לפי הצרכים והתקציב
            </p>
            <button className="btn-secondary">
              בואו נתכנן ביחד
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;