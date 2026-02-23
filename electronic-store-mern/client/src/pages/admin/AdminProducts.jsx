import { useState, useEffect } from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiX, FiSearch, FiSave, FiImage } from 'react-icons/fi';
import { getProducts } from '../../api/products';
import { createProduct, updateProduct, deleteProduct } from '../../api/admin';
import './AdminProducts.css';

const emptyProduct = {
  name: '', category: '', brand: '', price: '', originalPrice: '',
  image: '', badge: '', description: '', rating: 0, reviews: 0,
  features: '', featured: false, countInStock: 10,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // null = create, id = edit
  const [form, setForm] = useState({ ...emptyProduct });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadProducts = () => {
    setLoading(true);
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q));
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyProduct });
    setError('');
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name,
      category: product.category,
      brand: product.brand || '',
      price: product.price,
      originalPrice: product.originalPrice || '',
      image: product.image,
      badge: product.badge || '',
      description: product.description || '',
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      features: (product.features || []).join(', '),
      featured: product.featured || false,
      countInStock: product.countInStock ?? 10,
    });
    setError('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        rating: Number(form.rating),
        reviews: Number(form.reviews),
        countInStock: Number(form.countInStock),
        features: form.features ? form.features.split(',').map((f) => f.trim()).filter(Boolean) : [],
      };

      if (editing) {
        await updateProduct(editing, payload);
      } else {
        await createProduct(payload);
      }

      setShowModal(false);
      loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setDeleteConfirm(null);
      loadProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Products</h1>
          <p>{products.length} products total</p>
        </div>
        <button className="btn btn--primary" onClick={openCreate}>
          <FiPlus /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="admin-search">
        <FiSearch className="admin-search__icon" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search__input"
        />
      </div>

      {/* Table */}
      {loading ? (
        <p className="admin-loading">Loading products...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7" className="admin-table__empty">No products found</td></tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img src={product.image} alt="" className="admin-table__img" />
                    </td>
                    <td>
                      <div className="admin-table__name">{product.name}</div>
                      <div className="admin-table__brand">{product.brand}</div>
                    </td>
                    <td><span className="admin-table__cat">{product.category}</span></td>
                    <td className="admin-table__price">${product.price.toFixed(2)}</td>
                    <td>
                      <span className={`admin-table__stock ${product.countInStock <= 0 ? 'admin-table__stock--out' : ''}`}>
                        {product.countInStock}
                      </span>
                    </td>
                    <td>{product.featured ? '★' : '—'}</td>
                    <td>
                      <div className="admin-table__actions">
                        <button className="admin-table__btn admin-table__btn--edit" onClick={() => openEdit(product)} title="Edit">
                          <FiEdit3 />
                        </button>
                        <button className="admin-table__btn admin-table__btn--delete" onClick={() => setDeleteConfirm(product._id)} title="Delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal admin-modal--sm" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Product?</h3>
            <p>This action cannot be undone.</p>
            <div className="admin-modal__actions">
              <button className="btn btn--outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn--danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="admin-modal__close" onClick={() => setShowModal(false)}><FiX /></button>
            </div>

            {error && <div className="admin-modal__error">{error}</div>}

            <form onSubmit={handleSubmit} className="admin-modal__form">
              <div className="admin-modal__grid">
                <div className="admin-modal__field">
                  <label>Product Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="admin-modal__field">
                  <label>Category *</label>
                  <input name="category" value={form.category} onChange={handleChange} required />
                </div>
                <div className="admin-modal__field">
                  <label>Brand</label>
                  <input name="brand" value={form.brand} onChange={handleChange} />
                </div>
                <div className="admin-modal__field">
                  <label>Price *</label>
                  <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
                </div>
                <div className="admin-modal__field">
                  <label>Original Price</label>
                  <input name="originalPrice" type="number" step="0.01" min="0" value={form.originalPrice} onChange={handleChange} />
                </div>
                <div className="admin-modal__field">
                  <label>Stock</label>
                  <input name="countInStock" type="number" min="0" value={form.countInStock} onChange={handleChange} />
                </div>
              </div>

              <div className="admin-modal__field">
                <label><FiImage /> Image URL *</label>
                <input name="image" value={form.image} onChange={handleChange} required placeholder="https://..." />
              </div>

              <div className="admin-modal__grid">
                <div className="admin-modal__field">
                  <label>Badge</label>
                  <input name="badge" value={form.badge} onChange={handleChange} placeholder="e.g. New, Sale" />
                </div>
                <div className="admin-modal__field">
                  <label>Rating (0-5)</label>
                  <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} />
                </div>
                <div className="admin-modal__field">
                  <label>Reviews Count</label>
                  <input name="reviews" type="number" min="0" value={form.reviews} onChange={handleChange} />
                </div>
              </div>

              <div className="admin-modal__field">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
              </div>

              <div className="admin-modal__field">
                <label>Features (comma separated)</label>
                <input name="features" value={form.features} onChange={handleChange} placeholder="Feature 1, Feature 2, ..." />
              </div>

              <label className="admin-modal__checkbox">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                <span>Featured Product</span>
              </label>

              <div className="admin-modal__actions">
                <button type="button" className="btn btn--outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Saving...' : <><FiSave /> {editing ? 'Update' : 'Create'} Product</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
