import './StoreFooter.css';

export default function StoreFooter({
  categories,
  selectedCategory,
  onCategoryChange,
  isAdminLoggedIn,
  onAdminClick,
}) {
  const contactMessage = encodeURIComponent(
    '¡Hola! Me gustaría comunicarme con Test Perfumeria.',
  );

  return (
    <footer className="store-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-eyebrow">Test Perfumeria</span>
          <h2>Tu aroma, tu firma.</h2>
          <p>Fragancias originales para cada momento.</p>
        </div>

        <div className="footer-column">
          <h3>Explorar</h3>
          <div className="footer-categories">
            {categories.map((category) => (
              <button
                key={category}
                className={selectedCategory === category ? 'selected' : ''}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="footer-column footer-contact">
          <h3>¿Necesitas ayuda?</h3>
          <p>Escríbenos directamente y te atenderemos por WhatsApp.</p>
          <a
            href={`https://wa.me/8099384669?text=${contactMessage}`}
            target="_blank"
            rel="noreferrer"
          >
            Contactanos por WhatsApp <span aria-hidden="true">↗</span>
          </a>
          <button className="footer-admin-button" onClick={onAdminClick}>
            {isAdminLoggedIn ? 'Abrir panel admin' : 'Acceso admin'}
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Test Perfumeria</span>
        <span>Hecho para amantes de las fragancias</span>
      </div>
    </footer>
  );
}
