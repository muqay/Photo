import React, { useState } from 'react';
import { Menu, X, Camera, Phone, Mail } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { id: 'home', label: 'בית', labelEn: 'Home' },
    { id: 'portfolio', label: 'תיק עבודות', labelEn: 'Portfolio' },
    { id: 'services', label: 'שירותים', labelEn: 'Services' },
    { id: 'testimonials', label: 'המלצות', labelEn: 'Testimonials' },
    { id: 'contact', label: 'צור קשר', labelEn: 'Contact' }
  ];

  return (
    <header className="navbar">
      <div className="container-jewish">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Camera className="w-8 h-8 text-gray-800" />
            <div>
              <div className="photographer-name hebrew-text">יונתן לוי</div>
              <div className="caption-text">צלם אירועים יהודיים</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex nav-links">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="nav-link hover:text-gray-600 transition-colors hebrew-text"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:050-123-4567" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
              <Phone className="w-4 h-4" />
              050-123-4567
            </a>
            <a href="mailto:yonatan@jewishevents.co.il" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
              <Mail className="w-4 h-4" />
              צור קשר
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="nav-link text-right hebrew-text hover:text-gray-600 transition-colors py-2"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                <a href="tel:050-123-4567" className="flex items-center gap-2 text-sm text-gray-600 justify-end">
                  050-123-4567
                  <Phone className="w-4 h-4" />
                </a>
                <a href="mailto:yonatan@jewishevents.co.il" className="flex items-center gap-2 text-sm text-gray-600 justify-end">
                  צור קשר
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;