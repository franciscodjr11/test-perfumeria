import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

  return (
    <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      {product.isBestSeller && <span className="badge-gold">Popular</span>}
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <span className="product-brand">{product.brand}</span>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-notes"><strong>Aroma:</strong> {product.topNotes}</p>
        {isOutOfStock ? (
          <span className="stock-badge empty">Agotado</span>
        ) : (
          <span className="stock-badge available">Quedan {product.stock} unids.</span>
        )}
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className="btn-add-cart"
            disabled={isOutOfStock}
            onClick={() => addToCart(product)}
          >
            {isOutOfStock ? 'No disponible' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}