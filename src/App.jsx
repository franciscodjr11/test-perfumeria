import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import NavbarWithIntro from './components/NavbarWithIntro';
import WelcomeBanner from './components/WelcomeBanner';
import ProductGrid from './components/ProductGrid';
import CartModal from './components/CartModal';
import { categories } from './data/products';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <CartProvider>
      <div>
        <NavbarWithIntro
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <WelcomeBanner />
        <ProductGrid selectedCategory={selectedCategory} />
        <CartModal />
      </div>
    </CartProvider>
  );
}

export default App;