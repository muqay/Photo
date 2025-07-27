import React, { useState, useEffect } from 'react';
import { portfolioAPI, handleAPIError } from '../services/api';

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['All', 'Bar Mitzvah', 'Bat Mitzvah', 'Brit Milah', 'Torah Reading', 'Family Event'];

  useEffect(() => {
    fetchPortfolioItems();
  }, [selectedCategory]);

  const fetchPortfolioItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await portfolioAPI.getAll(selectedCategory);
      setPortfolioItems(response.data || []);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError(handleAPIError(err, 'Failed to load portfolio items'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="portfolio" className="section-spacing bg-gray-50">
        <div className="container-jewish">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-8"></div>
              <div className="grid portfolio-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-300 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="portfolio" className="section-spacing bg-gray-50">
        <div className="container-jewish">
          <div className="text-center">
            <h2 className="section-title hebrew-text">תיק עבודות</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 hebrew-text">{error}</p>
              <button 
                onClick={fetchPortfolioItems}
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
    <section id="portfolio" className="section-spacing bg-gray-50">
      <div className="container-jewish">
        <div className="text-center mb-12">
          <h2 className="section-title hebrew-text">תיק עבודות</h2>
          <p className="body-text text-gray-600 max-w-2xl mx-auto hebrew-text">
            אוסף מתמונותיי הטובות ביותר מאירועי מחזור החיים היהודיים
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-gray-300 hover:border-gray-400'
              }`}
            >
              {category === 'All' ? 'הכל' : 
               category === 'Bar Mitzvah' ? 'בר מצווה' :
               category === 'Bat Mitzvah' ? 'בת מצווה' :
               category === 'Brit Milah' ? 'ברית מילה' :
               category === 'Torah Reading' ? 'עלייה לתורה' :
               category === 'Family Event' ? 'אירוע משפחתי' :
               category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        {portfolioItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="body-text text-gray-500 hebrew-text">
              אין פריטים להצגה בקטגוריה זו
            </p>
          </div>
        ) : (
          <div className="portfolio-grid">
            {portfolioItems.map((item, index) => (
              <div
                key={item.id}
                className="image-overlay group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-w-4 aspect-h-3 h-80">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                </div>
                
                <div className="image-overlay-content">
                  <div className="hebrew-text text-right">
                    <h3 className="photographer-name text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="caption-text text-gray-200 mb-3">
                      {item.description}
                    </p>
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                      {item.category === 'Bar Mitzvah' ? 'בר מצווה' :
                       item.category === 'Bat Mitzvah' ? 'בת מצווה' :
                       item.category === 'Brit Milah' ? 'ברית מילה' :
                       item.category === 'Torah Reading' ? 'עלייה לתורה' :
                       item.category === 'Family Event' ? 'אירוע משפחתי' :
                       item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="body-text text-gray-600 mb-6 hebrew-text">
            רוצה לראות עוד עבודות? צור איתי קשר
          </p>
          <button 
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            צור קשר
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;