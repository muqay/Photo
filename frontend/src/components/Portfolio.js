import React, { useState } from 'react';
import { mockPortfolio } from '../mock';

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Bar Mitzvah', 'Bat Mitzvah', 'Brit Milah', 'Torah Reading', 'Family Event'];

  const filteredPortfolio = selectedCategory === 'All' 
    ? mockPortfolio 
    : mockPortfolio.filter(item => item.category === selectedCategory);

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
        <div className="portfolio-grid">
          {filteredPortfolio.map((item, index) => (
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