import React from 'react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      {product.isBestSeller && <span className="badge-gold">Popular</span>}
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <span className="product-brand">{product.brand}</span>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-notes"><strong>Aroma:</strong> {product.topNotes}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button className="btn-add-cart" onClick={() => addToCart(product)}>
            Pedir
          </button>
        </div>
      </div>
    </div>
  );
}