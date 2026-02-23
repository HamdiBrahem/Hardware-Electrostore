import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

export default function CartDrawer() {
  const { items, isOpen, closeCart, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.div
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="cart-drawer__header">
              <h2>
                <FiShoppingBag />
                Cart ({totalItems})
              </h2>
              <button className="cart-drawer__close" onClick={closeCart}>
                <FiX />
              </button>
            </div>

            <div className="cart-drawer__body">
              {items.length === 0 ? (
                <div className="cart-drawer__empty">
                  <FiShoppingBag size={48} />
                  <p>Your cart is empty</p>
                  <span>Start adding some products!</span>
                </div>
              ) : (
                <div className="cart-drawer__items">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item._id || item.id}
                        className="cart-item"
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30, height: 0 }}
                      >
                        <img src={item.image} alt={item.name} className="cart-item__img" />
                        <div className="cart-item__details">
                          <h4>{item.name}</h4>
                          <span className="cart-item__price">${item.price.toFixed(2)}</span>
                          <div className="cart-item__quantity">
                            <button onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}>
                              <FiMinus />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}>
                              <FiPlus />
                            </button>
                          </div>
                        </div>
                        <button
                          className="cart-item__remove"
                          onClick={() => removeFromCart(item._id || item.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="cart-drawer__footer">
                <div className="cart-drawer__total">
                  <span>Total</span>
                  <span className="cart-drawer__total-price">${totalPrice.toFixed(2)}</span>
                </div>
                <button className="cart-drawer__checkout-btn" onClick={handleCheckout}>
                  Checkout
                </button>
                <button className="cart-drawer__clear-btn" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
