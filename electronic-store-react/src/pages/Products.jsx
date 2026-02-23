import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiGrid, FiList, FiFilter } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import products, { categories } from '../data/products';
import './Products.css';

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A-Z' },
];

export default function Products() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('default');
  const [view, setView] = useState('grid');

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }

    return result;
  }, [search, category, sort]);

  return (
    <div className="products-page">
      {/* Page Header */}
      <section className="page-hero">
        <div className="page-hero__container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="page-hero__label">Collection</span>
            <h1 className="page-hero__title">All Products</h1>
            <p className="page-hero__subtitle">
              Browse our full catalog of premium electronics
            </p>
          </motion.div>
        </div>
      </section>

      <div className="products-page__container">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="toolbar__search">
            <FiSearch className="toolbar__search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="toolbar__search-input"
            />
          </div>

          <div className="toolbar__filters">
            <div className="toolbar__select-wrapper">
              <FiFilter className="toolbar__select-icon" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="toolbar__select"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="toolbar__view">
              <button
                className={`toolbar__view-btn ${view === 'grid' ? 'toolbar__view-btn--active' : ''}`}
                onClick={() => setView('grid')}
              >
                <FiGrid />
              </button>
              <button
                className={`toolbar__view-btn ${view === 'list' ? 'toolbar__view-btn--active' : ''}`}
                onClick={() => setView('list')}
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${category === cat ? 'category-tab--active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        <p className="results-count">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              className="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p>No products match your criteria.</p>
              <button className="btn btn--outline" onClick={() => { setSearch(''); setCategory('All'); }}>
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${category}-${sort}-${search}-${view}`}
              className={view === 'grid' ? 'products-grid' : 'products-list'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
