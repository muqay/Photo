import React from 'react';
import { Camera, Heart, Instagram, Facebook, Mail, Phone } from 'lucide-react';
import { mockContact, mockPhotographer } from '../mock';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white section-spacing">
      <div className="container-jewish">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          {/* Brand */}
          <div className="hebrew-text text-right">
            <div className="flex items-center gap-3 justify-end mb-4">
              <div>
                <div className="photographer-name text-white">{mockPhotographer.name}</div>
                <div className="caption-text text-gray-400">{mockPhotographer.tagline}</div>
              </div>
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <p className="caption-text text-gray-400 leading-relaxed">
              {mockPhotographer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="hebrew-text text-right">
            <h4 className="font-semibold text-white mb-6">קישורים מהירים</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="caption-text text-gray-400 hover:text-white transition-colors"
                >
                  בית
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('portfolio')}
                  className="caption-text text-gray-400 hover:text-white transition-colors"
                >
                  תיק עבודות
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="caption-text text-gray-400 hover:text-white transition-colors"
                >
                  שירותים
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="caption-text text-gray-400 hover:text-white transition-colors"
                >
                  המלצות
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="caption-text text-gray-400 hover:text-white transition-colors"
                >
                  צור קשר
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="hebrew-text text-right">
            <h4 className="font-semibold text-white mb-6">השירותים שלי</h4>
            <ul className="space-y-3">
              <li className="caption-text text-gray-400">בר מצוה</li>
              <li className="caption-text text-gray-400">בת מצוה</li>
              <li className="caption-text text-gray-400">ברית מילה</li>
              <li className="caption-text text-gray-400">עלייה לתורה</li>
              <li className="caption-text text-gray-400">אירועים משפחתיים</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="hebrew-text text-right">
            <h4 className="font-semibold text-white mb-6">צור קשר</h4>
            <div className="space-y-4">
              <a
                href={`tel:${mockContact.phone}`}
                className="flex items-center gap-3 justify-end caption-text text-gray-400 hover:text-white transition-colors"
              >
                {mockContact.phone}
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${mockContact.email}`}
                className="flex items-center gap-3 justify-end caption-text text-gray-400 hover:text-white transition-colors"
              >
                {mockContact.email}
                <Mail className="w-4 h-4" />
              </a>
              
              {/* Social Media */}
              <div className="flex gap-3 justify-end pt-4">
                <a
                  href={`https://instagram.com/${mockContact.socialMedia.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-gray-400" />
                </a>
                <a
                  href={`https://facebook.com/${mockContact.socialMedia.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Facebook className="w-5 h-5 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 caption-text">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for capturing precious moments</span>
            </div>
            
            <div className="hebrew-text text-right">
              <p className="caption-text text-gray-400">
                © {currentYear} {mockPhotographer.name}. כל הזכויות שמורות.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;