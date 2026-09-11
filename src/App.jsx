import { CartProvider } from './context/CartContext';
import NavbarWithIntro from './components/NavbarWithIntro';
import WelcomeBanner from './components/WelcomeBanner';
import ProductGrid from './components/ProductGrid';
import CartModal from './components/CartModal';

function App() {
  return (
    <CartProvider>
      <div>
        <NavbarWithIntro />
        <WelcomeBanner />
        <ProductGrid />
        <CartModal />
      </div>
    </CartProvider>
  );
}

export default App;