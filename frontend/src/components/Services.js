import React from 'react';
import { Camera, Clock, CheckCircle, Star } from 'lucide-react';
import { mockServices } from '../mock';

const Services = () => {
  return (
    <section id="services" className="section-spacing">
      <div className="container-jewish">
        <div className="text-center mb-12">
          <h2 className="section-title hebrew-text">השירותים שלי</h2>
          <p className="body-text text-gray-600 max-w-2xl mx-auto hebrew-text">
            צילום מקצועי לכל סוגי האירועים היהודיים במחירים הוגנים ושירות אישי
          </p>
        </div>

        <div className="services-grid">
          {mockServices.map((service, index) => (
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
                  {service.includes.map((item, idx) => (
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