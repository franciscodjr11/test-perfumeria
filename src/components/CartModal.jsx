import React from 'react';
import { useCart } from '../context/CartContext';
import './CartModal.css';

export default function CartModal() {
  const { cart, removeFromCart, updateQuantity, total, isCartOpen, setIsCartOpen } = useCart();

  // Reemplazar con el número de WhatsApp de la vendedora (con código de país, ej: 18091234567)
  const PHONE_NUMBER = '18090000000';

  if (!isCartOpen) return null;

  const handleSendWhatsApp = () => {
    if (cart.length === 0) return;

    let message = `¡Hola! Quisiera realizar el siguiente pedido en *Todo Aroma*:\n\n`;
    cart.forEach((item) => {
      message += `• *${item.name}* (${item.brand}) x${item.quantity} - $${(
        item.price * item.quantity
      ).toFixed(2)}\n`;
    });
    message += `\n*Total estimado:* $${total.toFixed(2)}\n\n¿Tienen disponibilidad para coordinar la entrega?`;

    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Tu Pedido</h2>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            ✕
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <p className="empty-cart">Aún no has agregado perfumes.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <span className="cart-item-brand">{item.brand}</span>
                  <span className="cart-item-price">${item.price.toFixed(2)}</span>
                </div>
                <div className="cart-item-actions">
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="whatsapp-btn" onClick={handleSendWhatsApp}>
              Pedir por WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}