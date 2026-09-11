import './WelcomeBanner.css';

export default function WelcomeBanner() {
  // Lógica para determinar el saludo según la hora del día
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return '¡Buenos días!';
    if (hour >= 12 && hour < 18) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  return (
    <section className="welcome-banner">
      <div className="banner-content">
        <span className="banner-badge">Fragancias 100% Originales</span>
        <h1 className="banner-title">{getGreeting()}</h1>
        <p className="banner-subtitle">
          Encuentra los mejores perfumes de tus marcas favoritas al mejor precio y haz tu pedido directamente por WhatsApp.
        </p>
      </div>
    </section>
  );
}