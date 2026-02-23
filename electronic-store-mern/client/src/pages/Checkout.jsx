import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiMapPin, FiCreditCard, FiCheck, FiArrowLeft,
  FiShoppingBag, FiTruck, FiShield, FiPackage
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/orders';
import './Checkout.css';

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [error, setError] = useState('');

  const [shipping, setShipping] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  const [payment, setPayment] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  // Not logged in
  if (!user) {
    return (
      <div className="checkout-page">
        <section className="page-hero">
          <div className="page-hero__container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="page-hero__label">Checkout</span>
              <h1 className="page-hero__title">Sign In Required</h1>
              <p className="page-hero__subtitle">You need to sign in before checking out</p>
            </motion.div>
          </div>
        </section>
        <div className="checkout__container" style={{ textAlign: 'center', padding: '3rem' }}>
          <Link to="/account" className="btn btn--primary">Sign In / Register</Link>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-page">
        <section className="page-hero">
          <div className="page-hero__container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="page-hero__label">Checkout</span>
              <h1 className="page-hero__title">Your Cart is Empty</h1>
              <p className="page-hero__subtitle">Add some products before checking out</p>
            </motion.div>
          </div>
        </section>
        <div className="checkout__container" style={{ textAlign: 'center', padding: '3rem' }}>
          <Link to="/products" className="btn btn--primary"><FiShoppingBag /> Browse Products</Link>
        </div>
      </div>
    );
  }

  // Order confirmation
  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <section className="page-hero">
          <div className="page-hero__container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="page-hero__label">Thank You!</span>
              <h1 className="page-hero__title">Order Confirmed</h1>
              <p className="page-hero__subtitle">Your order has been placed successfully</p>
            </motion.div>
          </div>
        </section>
        <div className="checkout__container">
          <motion.div
            className="checkout__confirmation"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="checkout__confirm-icon">
              <FiCheck />
            </div>
            <h2>Order #{orderPlaced._id.slice(-8).toUpperCase()}</h2>
            <p className="checkout__confirm-text">
              We've received your order and will begin processing it shortly.
              You can track your order status in your profile.
            </p>
            <div className="checkout__confirm-details">
              <div className="checkout__confirm-row">
                <span>Items</span>
                <span>{orderPlaced.items.length} product{orderPlaced.items.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="checkout__confirm-row">
                <span>Total</span>
                <span className="checkout__confirm-total">${orderPlaced.totalPrice.toFixed(2)}</span>
              </div>
              <div className="checkout__confirm-row">
                <span>Status</span>
                <span className="checkout__confirm-status">Pending</span>
              </div>
            </div>
            <div className="checkout__confirm-actions">
              <Link to="/profile" className="btn btn--primary">
                <FiPackage /> View My Orders
              </Link>
              <Link to="/products" className="btn btn--outline">
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const shippingCost = totalPrice >= 100 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shippingCost + tax;

  const validateShipping = () => {
    return shipping.firstName && shipping.lastName && shipping.address &&
      shipping.city && shipping.postalCode && shipping.country;
  };

  const validatePayment = () => {
    return payment.cardName && payment.cardNumber.length >= 16 &&
      payment.expiry && payment.cvv.length >= 3;
  };

  const handleNext = () => {
    setError('');
    if (step === 0 && !validateShipping()) {
      setError('Please fill in all shipping fields');
      return;
    }
    if (step === 1 && !validatePayment()) {
      setError('Please fill in all payment fields');
      return;
    }
    setStep(step + 1);
  };

  const handlePlaceOrder = async () => {
    setError('');
    setPlacing(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          product: item._id || item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          address: shipping.address,
          city: shipping.city,
          postalCode: shipping.postalCode,
          country: shipping.country,
        },
        totalPrice: Math.round(orderTotal * 100) / 100,
      };
      const res = await createOrder(orderData);
      setOrderPlaced(res.data);
      clearCart();
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  return (
    <div className="checkout-page">
      <section className="page-hero">
        <div className="page-hero__container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="page-hero__label">Checkout</span>
            <h1 className="page-hero__title">Complete Your Order</h1>
            <p className="page-hero__subtitle">Secure checkout — your information is protected</p>
          </motion.div>
        </div>
      </section>

      <div className="checkout__container">
        {/* Progress Steps */}
        <div className="checkout__steps">
          {STEPS.map((label, i) => (
            <div key={label} className={`checkout__step ${i <= step ? 'checkout__step--active' : ''} ${i < step ? 'checkout__step--done' : ''}`}>
              <div className="checkout__step-circle">
                {i < step ? <FiCheck /> : i + 1}
              </div>
              <span className="checkout__step-label">{label}</span>
              {i < STEPS.length - 1 && <div className="checkout__step-line" />}
            </div>
          ))}
        </div>

        <div className="checkout__layout">
          {/* Form Section */}
          <motion.div
            className="checkout__form-section"
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error && <div className="checkout__error">{error}</div>}

            {/* STEP 0: Shipping */}
            {step === 0 && (
              <div className="checkout__card">
                <h2 className="checkout__card-title"><FiMapPin /> Shipping Address</h2>
                <div className="checkout__fields checkout__fields--2col">
                  <div className="checkout__field">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={shipping.firstName}
                      onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="checkout__field">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={shipping.lastName}
                      onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div className="checkout__field">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div className="checkout__fields checkout__fields--3col">
                  <div className="checkout__field">
                    <label>City *</label>
                    <input
                      type="text"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div className="checkout__field">
                    <label>Postal Code *</label>
                    <input
                      type="text"
                      value={shipping.postalCode}
                      onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                      placeholder="10001"
                      required
                    />
                  </div>
                  <div className="checkout__field">
                    <label>Country *</label>
                    <input
                      type="text"
                      value={shipping.country}
                      onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                      placeholder="United States"
                      required
                    />
                  </div>
                </div>
                <div className="checkout__field">
                  <label>Phone (optional)</label>
                  <input
                    type="tel"
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            )}

            {/* STEP 1: Payment */}
            {step === 1 && (
              <div className="checkout__card">
                <h2 className="checkout__card-title"><FiCreditCard /> Payment Details</h2>
                <div className="checkout__field">
                  <label>Name on Card *</label>
                  <input
                    type="text"
                    value={payment.cardName}
                    onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="checkout__field">
                  <label>Card Number *</label>
                  <input
                    type="text"
                    value={formatCardNumber(payment.cardNumber)}
                    onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>
                <div className="checkout__fields checkout__fields--2col">
                  <div className="checkout__field">
                    <label>Expiry Date *</label>
                    <input
                      type="text"
                      value={formatExpiry(payment.expiry)}
                      onChange={(e) => setPayment({ ...payment, expiry: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="checkout__field">
                    <label>CVV *</label>
                    <input
                      type="text"
                      value={payment.cvv}
                      onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
                <div className="checkout__secure-note">
                  <FiShield /> Your payment information is encrypted and secure
                </div>
              </div>
            )}

            {/* STEP 2: Review */}
            {step === 2 && (
              <div className="checkout__card">
                <h2 className="checkout__card-title"><FiPackage /> Order Review</h2>

                <div className="checkout__review-section">
                  <h3>Shipping To</h3>
                  <p>
                    {shipping.firstName} {shipping.lastName}<br />
                    {shipping.address}<br />
                    {shipping.city}, {shipping.postalCode}<br />
                    {shipping.country}
                    {shipping.phone && <><br />{shipping.phone}</>}
                  </p>
                </div>

                <div className="checkout__review-section">
                  <h3>Payment</h3>
                  <p>
                    {payment.cardName}<br />
                    Card ending in ****{payment.cardNumber.slice(-4)}
                  </p>
                </div>

                <div className="checkout__review-section">
                  <h3>Items ({items.length})</h3>
                  <div className="checkout__review-items">
                    {items.map((item) => (
                      <div key={item._id || item.id} className="checkout__review-item">
                        <img src={item.image} alt={item.name} />
                        <div className="checkout__review-item-info">
                          <span className="checkout__review-item-name">{item.name}</span>
                          <span className="checkout__review-item-qty">Qty: {item.quantity}</span>
                        </div>
                        <span className="checkout__review-item-price">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="checkout__nav">
              {step > 0 && (
                <button className="btn btn--outline" onClick={() => { setStep(step - 1); setError(''); }}>
                  <FiArrowLeft /> Back
                </button>
              )}
              <div style={{ flex: 1 }} />
              {step < 2 ? (
                <button className="btn btn--primary" onClick={handleNext}>
                  Continue
                </button>
              ) : (
                <button className="btn btn--primary checkout__place-btn" onClick={handlePlaceOrder} disabled={placing}>
                  {placing ? 'Placing Order...' : `Place Order — $${orderTotal.toFixed(2)}`}
                </button>
              )}
            </div>
          </motion.div>

          {/* Order Summary Sidebar */}
          <div className="checkout__summary">
            <div className="checkout__summary-card">
              <h3 className="checkout__summary-title">Order Summary</h3>

              <div className="checkout__summary-items">
                {items.map((item) => (
                  <div key={item._id || item.id} className="checkout__summary-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <span className="checkout__summary-item-name">{item.name}</span>
                      <span className="checkout__summary-item-qty">× {item.quantity}</span>
                    </div>
                    <span className="checkout__summary-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="checkout__summary-totals">
                <div className="checkout__summary-row">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="checkout__summary-row">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="checkout__summary-row">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="checkout__summary-divider" />
                <div className="checkout__summary-row checkout__summary-row--total">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              {shippingCost === 0 && (
                <div className="checkout__summary-perk">
                  <FiTruck /> Free shipping on orders over $100
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
