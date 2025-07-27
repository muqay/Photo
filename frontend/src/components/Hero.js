import React from 'react';
import { Camera, Award, MapPin } from 'lucide-react';
import { mockPhotographer } from '../mock';

const Hero = () => {
  const scrollToPortfolio = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-background"></div>
      <div className="container-jewish">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="hero-content animate-fade-in-up">
            <div className="hebrew-text text-right">
              <h1 className="hero-title mb-6">
                {mockPhotographer.tagline}
              </h1>
              <p className="body-text mb-8 text-gray-600">
                {mockPhotographer.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-end">
                <button 
                  onClick={scrollToPortfolio}
                  className="btn-primary"
                >
                  <Camera className="w-5 h-5" />
                  צפה בעבודות
                </button>
                <button 
                  onClick={scrollToContact}
                  className="btn-secondary"
                >
                  צור קשר
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-end text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span className="caption-text">{mockPhotographer.experience}</span>
                  <Award className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="caption-text">{mockPhotographer.location}</span>
                  <MapPin className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery Preview */}
          <div className="animate-slide-in-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="image-overlay h-48">
                  <img 
                    src="https://images.unsplash.com/photo-1658889849723-0191c8ac8c61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwyfHxCYXIlMjBNaXR6dmFofGVufDB8fHx8MTc1MzY1MDEwNHww&ixlib=rb-4.1.0&q=85" 
                    alt="Bar Mitzvah Photography"
                    className="rounded-lg"
                  />
                </div>
                <div className="image-overlay h-32">
                  <img 
                    src="https://images.unsplash.com/photo-1661919858163-6d56dc4bec97?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxUb3JhaCUyMHJlYWRpbmd8ZW58MHx8fHwxNzUzNjUwMTA4fDA&ixlib=rb-4.1.0&q=85" 
                    alt="Torah Reading"
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="image-overlay h-32">
                  <img 
                    src="https://images.unsplash.com/photo-1578154450695-aa2f8d2b10a2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxCYXIlMjBNaXR6dmFofGVufDB8fHx8MTc1MzY1MDEwNHww&ixlib=rb-4.1.0&q=85" 
                    alt="Jewish Prayer"
                    className="rounded-lg"
                  />
                </div>
                <div className="image-overlay h-48">
                  <img 
                    src="https://images.unsplash.com/photo-1549575483-5ed15f0353b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwzfHxCYXIlMjBNaXR6dmFofGVufDB8fHx8MTc1MzY1MDEwNHww&ixlib=rb-4.1.0&q=85" 
                    alt="Father and Son at Western Wall"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;