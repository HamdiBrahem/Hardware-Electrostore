import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTruck, FiShield, FiHeadphones, FiCreditCard } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import { brands, testimonials } from '../data/products';
import { getProducts } from '../api/products';
import './Home.css';

const perks = [
  { icon: <FiTruck />, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: <FiShield />, title: '2 Year Warranty', desc: 'Full protection' },
  { icon: <FiHeadphones />, title: '24/7 Support', desc: 'Always here for you' },
  { icon: <FiCreditCard />, title: 'Secure Payment', desc: 'SSL encrypted' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    getProducts({ featured: true })
      .then((res) => setFeaturedProducts(res.data))
      .catch(() => setFeaturedProducts([]));

    getProducts({ sort: 'newest', limit: 4 })
      .then((res) => setLatestProducts(res.data.filter(p => !p.featured).slice(0, 4)))
      .catch(() => setLatestProducts([]));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__gradient" />
          <div className="hero__grid-pattern" />
        </div>

        <div className="hero__container">
          <motion.div
            className="hero__content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="hero__badge">Up to 40% Off This Season</span>
            <h1 className="hero__title">
              Next-Gen <span className="hero__highlight">Hardware</span> at
              Unbeatable Prices
            </h1>
            <p className="hero__subtitle">
              Discover the latest in consumer electronics — from gaming laptops
              to flagship smartphones. Premium tech, accessible to everyone.
            </p>
            <div className="hero__actions">
              <Link to="/products" className="btn btn--primary btn--lg">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/about" className="btn btn--ghost btn--lg">
                Learn More
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero__image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="hero__image-glow" />
            <img src="/images/home-image.jpg" alt="Electronics" />
          </motion.div>
        </div>
      </section>

      {/* Perks */}
      <section className="perks">
        <div className="perks__container">
          {perks.map((perk, i) => (
            <motion.div
              key={i}
              className="perk"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="perk__icon">{perk.icon}</div>
              <div>
                <h4 className="perk__title">{perk.title}</h4>
                <p className="perk__desc">{perk.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="section__container">
          <motion.div className="section__header" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span className="section__label">Browse</span>
            <h2 className="section__title">Shop by Category</h2>
          </motion.div>

          <div className="categories-grid">
            {[
              { img: '/images/category1.jpg', label: 'Computers' },
              { img: '/images/category2.jpg', label: 'Phones & Tablets' },
              { img: '/images/category3.jpg', label: 'Accessories' },
            ].map((cat, i) => (
              <motion.div
                key={i}
                className="category-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Link to="/products">
                  <img src={cat.img} alt={cat.label} />
                  <div className="category-card__overlay">
                    <span>{cat.label}</span>
                    <FiArrowRight />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="section__container">
          <motion.div className="section__header" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span className="section__label">Featured</span>
            <h2 className="section__title">Top Picks for You</h2>
          </motion.div>

          <div className="products-grid">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product._id || product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* PromoSection */}
      <section className="promo">
        <div className="promo__container">
          <motion.div
            className="promo__image"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img src="/images/s23.jpg" alt="S23 Ultra" />
          </motion.div>
          <motion.div
            className="promo__content"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="promo__exclusive">Exclusive Deal</span>
            <h2 className="promo__title">Samsung Galaxy S23 Ultra</h2>
            <p className="promo__text">
              Experience the power of 200MP photography, 8K video recording, and the
              S Pen built right in. The most powerful Galaxy yet.
            </p>
            <Link to="/products" className="btn btn--primary btn--lg">
              Buy Now <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="section">
        <div className="section__container">
          <motion.div className="section__header" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span className="section__label">New Arrivals</span>
            <h2 className="section__title">Latest Products</h2>
          </motion.div>

          <div className="products-grid">
            {latestProducts.map((product, i) => (
              <ProductCard key={product._id || product.id} product={product} index={i} />
            ))}
          </div>

          <motion.div
            className="section__action"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/products" className="btn btn--outline">
              View All Products <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="section__container">
          <motion.div className="section__header" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span className="section__label">Reviews</span>
            <h2 className="section__title">What Our Customers Say</h2>
          </motion.div>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <FaQuoteLeft className="testimonial-card__quote" />
                <p className="testimonial-card__text">{t.text}</p>
                <StarRating rating={t.rating} />
                <div className="testimonial-card__author">
                  <img src={t.avatar} alt={t.name} />
                  <span>{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="section brands-section">
        <div className="section__container">
          <motion.div className="section__header" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span className="section__label">Partners</span>
            <h2 className="section__title">Trusted Brands</h2>
          </motion.div>

          <div className="brands-row">
            {brands.map((brand, i) => (
              <motion.div
                key={i}
                className="brand-logo"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.08 }}
              >
                <img src={brand.logo} alt={brand.name} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
