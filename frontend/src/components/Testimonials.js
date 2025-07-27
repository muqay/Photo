import React from 'react';
import { Star, Quote } from 'lucide-react';
import { mockTestimonials } from '../mock';

const Testimonials = () => {
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

  return (
    <section id="testimonials" className="section-spacing bg-gray-50">
      <div className="container-jewish">
        <div className="text-center mb-12">
          <h2 className="section-title hebrew-text">המלצות לקוחות</h2>
          <p className="body-text text-gray-600 max-w-2xl mx-auto hebrew-text">
            מה משפחות אומרות על השירות שלי
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {mockTestimonials.map((testimonial, index) => (
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

        {/* Google Reviews CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex">
              {renderStars(5)}
            </div>
            <div className="text-right hebrew-text">
              <p className="font-semibold text-gray-800">4.9/5 בממוצע</p>
              <p className="caption-text text-gray-600">מבוסס על 47+ ביקורות</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;