import { useState } from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ selectedCategory, products }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="catalog-container">
      <div className="catalog-header">
        <h2 className="catalog-title">Nuestra Colección</h2>

        {/* Barra de búsqueda */}
        <input
          type="text"
          placeholder="Buscar perfume..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </div>

      {/* Rejilla de Productos */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}