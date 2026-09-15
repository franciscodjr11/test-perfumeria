import { useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext';
import NavbarWithIntro from './components/NavbarWithIntro';
import WelcomeBanner from './components/WelcomeBanner';
import ProductGrid from './components/ProductGrid';
import CartModal from './components/CartModal';
import StoreFooter from './components/StoreFooter';
import AdminPanel, { AdminLoginModal } from './components/AdminPanel';
import { categories, products as initialProductsFromDataJS } from './data/products';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [productList, setProductList] = useState(() => {
    const savedProducts = localStorage.getItem('perfumeria_products');
    return savedProducts ? JSON.parse(savedProducts) : initialProductsFromDataJS;
  });

  useEffect(() => {
    localStorage.setItem('perfumeria_products', JSON.stringify(productList));
  }, [productList]);

  const handleSimulatedLogin = () => {
    setShowAdminModal(false);
    setIsAdminLoggedIn(true);
  };

  const handleAddProduct = (newProduct) => {
    setProductList((currentProducts) => [newProduct, ...currentProducts]);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProductList((currentProducts) => currentProducts.map((product) => (
      product.id === updatedProduct.id ? updatedProduct : product
    )));
  };

  const handleDeleteProduct = (id) => {
    setProductList((currentProducts) => currentProducts.filter((product) => product.id !== id));
  };

  return (
    <CartProvider>
      <div>
        <NavbarWithIntro
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <WelcomeBanner />
        <ProductGrid selectedCategory={selectedCategory} products={productList} />
        {isAdminLoggedIn && (
          <AdminPanel
            products={productList}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}
        <StoreFooter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          isAdminLoggedIn={isAdminLoggedIn}
          onAdminClick={() => setShowAdminModal(true)}
        />
        <CartModal />
        {showAdminModal && (
          <AdminLoginModal
            onClose={() => setShowAdminModal(false)}
            onLogin={handleSimulatedLogin}
          />
        )}
      </div>
    </CartProvider>
  );
}

export default App;