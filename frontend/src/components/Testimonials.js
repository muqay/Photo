import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { testimonialsAPI, handleAPIError } from '../services/api';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await testimonialsAPI.getAll();
      setTestimonials(response.data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(handleAPIError(err, 'Failed to load testimonials'));
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section id="testimonials" className="section-spacing bg-gray-50">
        <div className="container-jewish">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="testimonial-card animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-6"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="testimonials" className="section-spacing bg-gray-50">
        <div className="container-jewish">
          <div className="text-center">
            <h2 className="section-title hebrew-text">המלצות לקוחות</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 hebrew-text">{error}</p>
              <button 
                onClick={fetchTestimonials}
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
    <section id="testimonials" className="section-spacing bg-gray-50">
      <div className="container-jewish">
        <div className="text-center mb-12">
          <h2 className="section-title hebrew-text">המלצות לקוחות</h2>
          <p className="body-text text-gray-600 max-w-2xl mx-auto hebrew-text">
            מה משפחות אומרות על השירות שלי
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="body-text text-gray-500 hebrew-text">
              אין המלצות להצגה כרגע
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="testimonial-card animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="hebrew-text text-right">
                  {/* Quote Icon */}
                  <div className="flex justify-end mb-4">
                    <Quote className="w-8 h-8 text-gray-300 transform rotate-180" />
                  </div>

                  {/* Testimonial Text */}
                  <p className="body-text text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  {/* Rating */}
                  <div className="flex justify-end mb-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Client Info */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {testimonial.name}
                    </h4>
                    <p className="caption-text text-gray-500">
                      {testimonial.event}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Google Reviews CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex">
              {renderStars(5)}
            </div>
            <div className="text-right hebrew-text">
              <p className="font-semibold text-gray-800">4.9/5 בממוצע</p>
              <p className="caption-text text-gray-600">מבוסס על {testimonials.length}+ ביקורות</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;