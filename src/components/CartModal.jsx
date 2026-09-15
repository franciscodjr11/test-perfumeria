import React from 'react';
import { useCart } from '../context/CartContext';
import './CartModal.css';

export default function CartModal() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    total: totalAmount,
    clearCart,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;

    let message = '¡Hola! Quisiera consultar/encargar el siguiente pedido:\n\n';
    cart.forEach((item) => {
      message += `• ${item.name} (${item.quantity}x) - $${item.price * item.quantity}\n`;
    });
    message += `\n*Total estimado:* $${totalAmount}`;

    const whatsappPhone = import.meta.env.VITE_WHATSAPP_PHONE || '18090000000';
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;

    clearCart();
    window.open(whatsappUrl, '_blank');
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
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <button className="whatsapp-btn" onClick={handleCheckoutWhatsApp}>
              Pedir por WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}