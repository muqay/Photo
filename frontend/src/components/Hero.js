import React, { useState, useEffect } from 'react';
import { Camera, Award, MapPin } from 'lucide-react';
import { portfolioAPI, settingsAPI, handleAPIError } from '../services/api';

const Hero = () => {
  const [photographerInfo, setPhotographerInfo] = useState(null);
  const [featuredImages, setFeaturedImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      
      // Fetch photographer info and featured portfolio items
      const [settingsResponse, portfolioResponse] = await Promise.all([
        settingsAPI.getAll(),
        portfolioAPI.getFeatured()
      ]);

      const settings = settingsResponse.data || {};
      setPhotographerInfo(settings.photographer_info || {
        name: "ידידיה מלכא",
        tagline: "צלם אירועים יהודיים מקצועי",
        description: "מתמחה בצילום אירועי מחזור החיים היהודיים - בר/בת מצווה, בריתות, עליות לתורה ואירועים משפחתיים מיוחדים",
        experience: "15+ שנות ניסיון",
        location: "ירושלים וסביבותיה"
      });

      setFeaturedImages(portfolioResponse.data?.slice(0, 4) || []);
    } catch (error) {
      console.error('Error fetching hero data:', error);
      // Use fallback data
      setPhotographerInfo({
        name: "ידידיה מלכא",
        tagline: "צלם אירועים יהודיים מקצועי",
        description: "מתמחה בצילום אירועי מחזור החיים היהודיים - בר/בת מצווה, בריתות, עליות לתורה ואירועים משפחתיים מיוחדים",
        experience: "15+ שנות ניסיון",
        location: "ירושלים וסביבותיה"
      });
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <section id="home" className="hero-section">
        <div className="hero-background"></div>
        <div className="container-jewish">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-300 rounded mb-6"></div>
              <div className="h-6 bg-gray-300 rounded mb-8"></div>
              <div className="flex gap-4 mb-12">
                <div className="h-12 bg-gray-300 rounded w-32"></div>
                <div className="h-12 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="hero-section">
      <div className="hero-background"></div>
      <div className="container-jewish">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="hero-content animate-fade-in-up">
            <div className="hebrew-text text-right">
              <h1 className="hero-title mb-6">
                {photographerInfo.tagline}
              </h1>
              <p className="body-text mb-8 text-gray-600">
                {photographerInfo.description}
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
                  <span className="caption-text">{photographerInfo.experience}</span>
                  <Award className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="caption-text">{photographerInfo.location}</span>
                  <MapPin className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery Preview */}
          <div className="animate-slide-in-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {featuredImages[0] && (
                  <div className="image-overlay h-48">
                    <img 
                      src={featuredImages[0].image}
                      alt={featuredImages[0].title}
                      className="rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1658889849723-0191c8ac8c61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwyfHxCYXIlMjBNaXR6dmFofGVufDB8fHx8MTc1MzY1MDEwNHww&ixlib=rb-4.1.0&q=85";
                      }}
                    />
                  </div>
                )}
                {featuredImages[1] && (
                  <div className="image-overlay h-32">
                    <img 
                      src={featuredImages[1].image}
                      alt={featuredImages[1].title}
                      className="rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1661919858163-6d56dc4bec97?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxUb3JhaCUyMHJlYWRpbmd8ZW58MHx8fHwxNzUzNjUwMTA4fDA&ixlib=rb-4.1.0&q=85";
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="space-y-4 mt-8">
                {featuredImages[2] && (
                  <div className="image-overlay h-32">
                    <img 
                      src={featuredImages[2].image}
                      alt={featuredImages[2].title}
                      className="rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1578154450695-aa2f8d2b10a2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxCYXIlMjBNaXR6dmFofGVufDB8fHx8MTc1MzY1MDEwNHww&ixlib=rb-4.1.0&q=85";
                      }}
                    />
                  </div>
                )}
                {featuredImages[3] && (
                  <div className="image-overlay h-48">
                    <img 
                      src={featuredImages[3].image}
                      alt={featuredImages[3].title}
                      className="rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1549575483-5ed15f0353b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwzfHxCYXIlMjBNaXR6dmFofGVufDB8fHx8MTc1MzY1MDEwNHww&ixlib=rb-4.1.0&q=85";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;