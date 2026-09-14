import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { useCart } from '../context/CartContext';
import logoImage from '../../img/test-perfumeria-logo.png';

import './NavbarWithIntro.css';

gsap.registerPlugin(Flip);

export default function NavbarWithIntro({ categories, selectedCategory, onCategoryChange }) {
  const logoRef = useRef(null);
  const destinationRef = useRef(null);
  const overlayRef = useRef(null);
  const animationStartedRef = useRef(false);
  const { totalCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const logo = logoRef.current;
    const destination = destinationRef.current;
    const overlay = overlayRef.current;

    if (!logo || !destination || !overlay) return;

    let timer;

    const startAnimation = () => {
      timer = setTimeout(() => {
        if (animationStartedRef.current) return;
        animationStartedRef.current = true;

        const state = Flip.getState(logo);

        destination.appendChild(logo);
        logo.classList.remove('logo-hero');
        logo.classList.add('logo-nav');
        overlay.classList.add('is-animating');

        Flip.from(state, {
          duration: 2,
          ease: 'power2.inOut',
          absolute: true,
          onComplete: () => {
            gsap.to(overlay, {
              opacity: 0,
              duration: 0.6,
              onComplete: () => {
                overlay.style.display = 'none';
                overlay.classList.remove('is-animating');
              },
            });
          },
        });
      }, 1500); // 1.5 segundos
    };

    if (logo.complete) {
      startAnimation();
      return;
    }

    logo.addEventListener('load', startAnimation, { once: true });

    return () => {
      clearTimeout(timer);
      logo.removeEventListener('load', startAnimation);
    };
  }, []);

  return (
    <>
      {/* Pantalla de carga inicial */}
      <div ref={overlayRef} className="overlay">
        <img
          ref={logoRef}
          className="logo-hero"
          src={logoImage}
          alt="Test Perfumeria Logo"
        />
      </div>

      {/* Barra de navegación */}
      <nav className="navbar">
        <div ref={destinationRef} id="logo-destination"></div>

        <div className="category-nav" aria-label="Categorías de perfumes">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-nav-btn ${
                selectedCategory === category ? 'active' : ''
              }`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Indicador del Carrito en dorado */}
        <button className="cart-indicator" onClick={() => setIsCartOpen(true)}>
          🛒 Carrito ({totalCount})
        </button>
      </nav>
    </>
  );
}
