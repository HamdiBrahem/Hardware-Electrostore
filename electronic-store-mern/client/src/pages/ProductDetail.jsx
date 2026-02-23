import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiArrowLeft, FiCheck, FiTruck, FiShield, FiPackage, FiMinus, FiPlus } from 'react-icons/fi';
import StarRating from '../components/StarRating';
import { useCart } from '../context/CartContext';
import { getProduct } from '../api/products';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.message || 'Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="product-detail__loading">
          <div className="product-detail__spinner" />
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail__error">
          <h2>Product Not Found</h2>
          <p>{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/products" className="btn btn--primary">
            <FiArrowLeft /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <div className="product-detail__breadcrumb">
        <div className="product-detail__breadcrumb-inner">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span className="product-detail__breadcrumb-current">{product.name}</span>
        </div>
      </div>

      <div className="product-detail__container">
        {/* Image Section */}
        <motion.div
          className="product-detail__image-section"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="product-detail__image-wrapper">
            {product.badge && (
              <span className={`product-detail__badge product-detail__badge--${product.badge.toLowerCase().replace(' ', '-')}`}>
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="product-detail__discount-badge">-{discount}%</span>
            )}
            <img src={product.image} alt={product.name} className="product-detail__image" />
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          className="product-detail__info-section"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="product-detail__category">{product.category}</span>
          <h1 className="product-detail__name">{product.name}</h1>

          <div className="product-detail__brand">
            by <strong>{product.brand}</strong>
          </div>

          <div className="product-detail__rating-row">
            <StarRating rating={product.rating} />
            <span className="product-detail__reviews">({product.reviews} reviews)</span>
          </div>

          <div className="product-detail__price-block">
            <span className="product-detail__price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="product-detail__original-price">${product.originalPrice.toFixed(2)}</span>
            )}
            {discount > 0 && (
              <span className="product-detail__save">Save {discount}%</span>
            )}
          </div>

          <p className="product-detail__description">{product.description}</p>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="product-detail__features">
              <h3 className="product-detail__features-title">Key Features</h3>
              <ul className="product-detail__features-list">
                {product.features.map((feature, i) => (
                  <li key={i}>
                    <FiCheck className="product-detail__feature-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stock Status */}
          <div className="product-detail__stock">
            {product.countInStock > 0 ? (
              <span className="product-detail__in-stock">
                <FiCheck /> In Stock ({product.countInStock} available)
              </span>
            ) : (
              <span className="product-detail__out-of-stock">Out of Stock</span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          {product.countInStock > 0 && (
            <div className="product-detail__actions">
              <div className="product-detail__quantity">
                <button
                  className="product-detail__qty-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span className="product-detail__qty-value">{quantity}</span>
                <button
                  className="product-detail__qty-btn"
                  onClick={() => setQuantity(q => Math.min(product.countInStock, q + 1))}
                  disabled={quantity >= product.countInStock}
                >
                  <FiPlus />
                </button>
              </div>

              <button
                className={`btn btn--primary btn--lg product-detail__add-btn ${addedToCart ? 'product-detail__add-btn--added' : ''}`}
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <><FiCheck /> Added to Cart</>
                ) : (
                  <><FiShoppingCart /> Add to Cart</>
                )}
              </button>
            </div>
          )}

          {/* Perks */}
          <div className="product-detail__perks">
            <div className="product-detail__perk">
              <FiTruck />
              <span>Free shipping over $50</span>
            </div>
            <div className="product-detail__perk">
              <FiShield />
              <span>2-year warranty</span>
            </div>
            <div className="product-detail__perk">
              <FiPackage />
              <span>30-day returns</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
