import { useCart } from '../context/CartContext';
import './Productcard.css';

export default function ProductCard({ product }) {
  const { cart, addToCart } = useCart();
  const itemInCart = cart.find((item) => item.id === product.id);
  const cartQuantity = itemInCart ? itemInCart.quantity : 0;
  const isOutOfStock = product.stock <= 0;
  const isCartLimitReached = product.stock != null && cartQuantity >= product.stock;

  return (
    <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      {product.isBestSeller && <span className="badge-gold">Popular</span>}
      <div className="product-image-container">
        <img className="product-image" src={product.image} alt={product.name} />
        {isOutOfStock && <span className="badge-out">Agotado</span>}
        {!isOutOfStock && product.stock <= 3 && (
          <span className="badge-low-stock">¡Pocas unidades! ({product.stock})</span>
        )}
      </div>

      <div className="product-info">
        <span className="product-brand">{product.brand}</span>
        <h3>{product.name}</h3>
        <p className="product-notes">{product.notes || product.topNotes}</p>
        <p className="product-price">${product.price}</p>

        {/* Botón condicional según el stock */}
        <button
          disabled={isOutOfStock || isCartLimitReached}
          onClick={() => addToCart(product)}
          className={`btn-add-cart ${isCartLimitReached ? 'disabled' : ''}`}
        >
          {isOutOfStock
            ? 'Agotado'
            : isCartLimitReached
            ? 'Límite en carrito alcanzado'
            : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}