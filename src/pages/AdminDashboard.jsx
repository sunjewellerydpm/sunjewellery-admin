import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EditProductModal from '../components/EditProductModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import ConfirmationModal from '../components/ConfirmationModal';

const API_BASE = import.meta.env.VITE_API_BASE;
const ADMIN_KEY = localStorage.getItem('adminKey') || '';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [confirmation, setConfirmation] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check authentication
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
            navigate('/');
            return;
        }
        fetchProducts();
    }, [navigate]);

    useEffect(() => {
        // Set active tab based on route
        if (location.pathname === '/add-product') {
            setActiveTab('add-product');
        } else {
            setActiveTab('dashboard');
        }
    }, [location.pathname]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            let allProducts = [];
            let currentPage = 1;
            let totalPages = 1;

            // Fetch all pages for the admin dashboard
            while (currentPage <= totalPages) {
                const response = await fetch(`${API_BASE}/products?page=${currentPage}`);
                const data = await response.json();
                allProducts = [...allProducts, ...(data.products || [])];
                totalPages = data.totalPages || 1;
                currentPage++;
            }

            setProducts(allProducts.reverse());
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('adminKey');
        navigate('/');
    };

    const handleEditSave = async (updatedProduct) => {
        try {
            const response = await fetch(`${API_BASE}/edit-product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-key': ADMIN_KEY
                },
                body: JSON.stringify(updatedProduct)
            });

            if (response.ok) {
                setEditingProduct(null);
                setConfirmation({
                    type: 'success',
                    title: 'Product Updated',
                    message: 'The product has been successfully updated.'
                });
                fetchProducts();
            } else {
                throw new Error('Failed to update product');
            }
        } catch (error) {
            setConfirmation({
                type: 'error',
                title: 'Update Failed',
                message: 'Failed to update the product. Please try again.'
            });
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`${API_BASE}/delete/${deletingProduct.id}`, {
                method: 'DELETE',
                headers: {
                    'x-admin-key': ADMIN_KEY
                }
            });

            if (response.ok) {
                setDeletingProduct(null);
                setConfirmation({
                    type: 'success',
                    title: 'Product Deleted',
                    message: 'The product has been successfully deleted.'
                });
                fetchProducts();
            } else {
                throw new Error('Failed to delete product');
            }
        } catch (error) {
            setConfirmation({
                type: 'error',
                title: 'Delete Failed',
                message: 'Failed to delete the product. Please try again.'
            });
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src="https://res.cloudinary.com/dktx1ebxg/image/upload/v1768282931/logo_ibjz9b.png" alt="logo" className='h-12' />
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                        Admin Panel
                    </p>
                </div>

                <nav className="sidebar-nav">
                    <a
                        href="#"
                        className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveTab('dashboard');
                            navigate('/admindashboard');
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                        Dashboard
                    </a>

                    <a
                        href="#"
                        className={`sidebar-link ${activeTab === 'add-product' ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/add-product');
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="16" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        Add Product
                    </a>
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
                    <button
                        className="btn btn-ghost"
                        onClick={handleLogout}
                        style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">Products</h1>
                    <p className="page-description">Manage your jewelry inventory</p>
                </div>

                {/* Products Table */}
                <div className="card">
                    <div className="table-container">
                        {loading ? (
                            <div style={{
                                padding: '3rem',
                                textAlign: 'center',
                                color: 'var(--muted-foreground)'
                            }}>
                                <div className="animate-spin" style={{
                                    width: '32px',
                                    height: '32px',
                                    border: '3px solid var(--border)',
                                    borderTopColor: 'var(--gold)',
                                    borderRadius: '50%',
                                    margin: '0 auto 1rem'
                                }}></div>
                                Loading products...
                            </div>
                        ) : products.length === 0 ? (
                            <div style={{
                                padding: '3rem',
                                textAlign: 'center',
                                color: 'var(--muted-foreground)'
                            }}>
                                <p>No products found</p>
                                <button
                                    className="btn btn-primary"
                                    style={{ marginTop: '1rem' }}
                                    onClick={() => navigate('/add-product')}
                                >
                                    Add Your First Product
                                </button>
                            </div>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Product Code</th>
                                        <th>Name</th>
                                        <th>Weight</th>
                                        {/* <th>Price</th> */}
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td style={{ color: 'var(--muted-foreground)' }}>
                                                #{product.id}
                                            </td>
                                            <td>
                                                <span style={{
                                                    fontFamily: 'monospace',
                                                    backgroundColor: 'var(--secondary)',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    {product.product_code || '-'}
                                                </span>
                                            </td>
                                            <td style={{ fontWeight: '500' }}>{product.name}</td>
                                            <td>{product.weight || '-'}</td>
                                            {/* <td>
                                                <div>
                                                    {product.discountPrice && product.discountPrice < product.price ? (
                                                        <>
                                                            <span className="price-discount">
                                                                {formatPrice(product.discountPrice)}
                                                            </span>
                                                            <span className="price-original" style={{ marginLeft: '0.5rem' }}>
                                                                {formatPrice(product.price)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span>{formatPrice(product.price)}</span>
                                                    )}
                                                </div>
                                            </td> */}
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => setEditingProduct(product)}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-destructive btn-sm"
                                                        onClick={() => setDeletingProduct(product)}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>

            {/* Edit Modal */}
            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSave={handleEditSave}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deletingProduct && (
                <DeleteConfirmModal
                    product={deletingProduct}
                    onClose={() => setDeletingProduct(null)}
                    onConfirm={handleDeleteConfirm}
                />
            )}

            {/* Confirmation Modal */}
            {confirmation && (
                <ConfirmationModal
                    type={confirmation.type}
                    title={confirmation.title}
                    message={confirmation.message}
                    onClose={() => setConfirmation(null)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
