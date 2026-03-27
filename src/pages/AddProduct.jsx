import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';

const API_BASE = import.meta.env.VITE_API_BASE;
const ADMIN_KEY = localStorage.getItem('adminKey') || '';

console.log(ADMIN_KEY)

const AddProduct = () => {
    const [loading, setLoading] = useState(false);
    const [confirmation, setConfirmation] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discountPrice: '',
        category: '',
        description: '',
        weight: '',
        karat: '22K',
        product_code: ''
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        addImages(files);
    };

    const addImages = (files) => {
        files.forEach(file => {
            if (file && file.type.startsWith('image/')) {
                setImageFiles(prev => [...prev, file]);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result]);
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const removeImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const clearAllImages = () => {
        setImageFiles([]);
        setImagePreviews([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (imageFiles.length === 0) {
            setConfirmation({
                type: 'error',
                title: 'Image Required',
                message: 'Please upload at least one product image.'
            });
            return;
        }

        setLoading(true);

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('price', formData.price);
            submitData.append('category', formData.category);
            submitData.append('discountPrice', formData.discountPrice || '');
            submitData.append('description', formData.description || '');
            submitData.append('weight', formData.weight || '');
            submitData.append('karat', formData.karat || '22K');
            submitData.append('product_code', formData.product_code || '');

            // Append all images with the same field name 'images'
            imageFiles.forEach(file => {
                submitData.append('images', file);
            });

            const response = await fetch(`${API_BASE}/add-product`, {
                method: 'POST',
                headers: {
                    'x-admin-key': ADMIN_KEY
                },
                body: submitData
            });

            if (response.ok) {
                setConfirmation({
                    type: 'success',
                    title: 'Product Added',
                    message: 'The product has been successfully added to your inventory.'
                });
                // Reset form
                setFormData({
                    name: '',
                    price: '',
                    discountPrice: '',
                    category: '',
                    description: '',
                    weight: '',
                    karat: '22K',
                    product_code: ''
                });
                setImageFiles([]);
                setImagePreviews([]);
            } else {
                throw new Error('Failed to add product');
            }
        } catch (error) {
            setConfirmation({
                type: 'error',
                title: 'Failed to Add Product',
                message: 'There was an error adding the product. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('adminKey');
        navigate('/');
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
                        className="sidebar-link"
                        onClick={(e) => {
                            e.preventDefault();
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
                        className="sidebar-link active"
                        onClick={(e) => e.preventDefault()}
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
            <main className="main-content flex flex-col items-center">
                <div className="page-header">
                    <h1 className="page-title">Add New Product</h1>
                    <p className="page-description">Fill in the details to add a new jewelry product</p>
                </div>

                <div className="card" style={{ padding: '2rem', width: '100%', maxWidth: '800px' }}>
                    <form onSubmit={handleSubmit}>
                        {/* Row 1: Product Code */}
                        <div className="form-group">
                            <label className="label" htmlFor="product_code">Product Code *</label>
                            <input
                                type="text"
                                id="product_code"
                                name="product_code"
                                className="input"
                                placeholder="e.g., GB2203"
                                value={formData.product_code}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Row 2: Name */}
                        <div className="form-group">
                            <label className="label" htmlFor="name">Product Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="input"
                                placeholder="e.g., 22K Gold Bracelet"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Row 3: Price and Discount Price */}
                        {/* <div className="form-row">
                            <div className="form-group">
                                <label className="label" htmlFor="price">Price (₹) *</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    className="input"
                                    placeholder="e.g., 38000"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="label" htmlFor="discountPrice">Discount Price (₹)</label>
                                <input
                                    type="number"
                                    id="discountPrice"
                                    name="discountPrice"
                                    className="input"
                                    placeholder="e.g., 35000"
                                    value={formData.discountPrice}
                                    onChange={handleChange}
                                />
                            </div>
                        </div> */}

                        {/* Row 4: Category and Karat */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="label" htmlFor="category">Category *</label>
                                <select
                                    id="category"
                                    name="category"
                                    className="input"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select category</option>
                                    <option value="chains">Chains</option>
                                    <option value="harams-necklaces">Harams & Necklaces</option>
                                    <option value="bangles">Bangles</option>
                                    <option value="ladies-bracelets">Ladies Bracelets</option>
                                    <option value="gents-bracelets">Gents Bracelets</option>
                                    <option value="ladies-rings">Ladies Rings</option>
                                    <option value="gents-rings">Gents Rings</option>
                                    <option value="studs-earrings">Studs & Earrings</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="label" htmlFor="karat">Karat *</label>
                                <select
                                    id="karat"
                                    name="karat"
                                    className="input"
                                    value={formData.karat}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="22K">22K Gold</option>
                                    <option value="24K">24K Gold</option>
                                    <option value="18K">18K Gold</option>
                                    <option value="14K">14K Gold</option>
                                    <option value="Silver">Silver</option>
                                </select>
                            </div>
                        </div>

                        {/* Row 5: Weight */}
                        <div className="form-group">
                            <label className="label" htmlFor="weight">Weight *</label>
                            <input
                                type="text"
                                id="weight"
                                name="weight"
                                className="input"
                                placeholder="e.g., 8g"
                                value={formData.weight}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Row 6: Product Images Upload */}
                        <div className="form-group">
                            <label className="label">Product Images * <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--muted-foreground)' }}>(You can upload multiple images)</span></label>

                            {/* Upload Zone */}
                            <div
                                style={{
                                    border: '2px dashed var(--border)',
                                    borderRadius: 'var(--radius)',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: 'var(--input)',
                                    marginBottom: imagePreviews.length > 0 ? '1rem' : 0
                                }}
                                onClick={() => document.getElementById('images').click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = 'var(--gold)';
                                }}
                                onDragLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                                    addImages(files);
                                }}
                            >
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--muted-foreground)"
                                    strokeWidth="1.5"
                                    style={{ margin: '0 auto 0.75rem' }}
                                >
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                <p style={{ color: 'var(--foreground)', fontWeight: '500', marginBottom: '0.25rem' }}>
                                    Click to upload or drag and drop
                                </p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                                    PNG, JPG or WEBP (max 5MB each)
                                </p>
                            </div>

                            {/* Image Previews Grid */}
                            {imagePreviews.length > 0 && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>
                                            {imagePreviews.length} image{imagePreviews.length > 1 ? 's' : ''} selected
                                        </p>
                                        <button
                                            type="button"
                                            onClick={clearAllImages}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--destructive)',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                        gap: '0.75rem'
                                    }}>
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} style={{ position: 'relative' }}>
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100px',
                                                        objectFit: 'cover',
                                                        borderRadius: 'var(--radius)',
                                                        border: '1px solid var(--border)'
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-6px',
                                                        right: '-6px',
                                                        width: '20px',
                                                        height: '20px',
                                                        borderRadius: '50%',
                                                        backgroundColor: 'var(--destructive)',
                                                        color: 'white',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <input
                                type="file"
                                id="images"
                                name="images"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </div>

                        {/* Row 7: Description */}
                        <div className="form-group">
                            <label className="label" htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                className="input textarea"
                                placeholder="Enter product description..."
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                            />
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ minWidth: '140px' }}
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin" style={{
                                            display: 'inline-block',
                                            width: '14px',
                                            height: '14px',
                                            border: '2px solid transparent',
                                            borderTopColor: 'currentColor',
                                            borderRadius: '50%'
                                        }}></span>
                                        Adding...
                                    </>
                                ) : (
                                    'Add Product'
                                )}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/admindashboard')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Confirmation Modal */}
            {confirmation && (
                <ConfirmationModal
                    type={confirmation.type}
                    title={confirmation.title}
                    message={confirmation.message}
                    onClose={() => {
                        setConfirmation(null);
                        if (confirmation.type === 'success') {
                            navigate('/admindashboard');
                        }
                    }}
                />
            )}
        </div>
    );
};

export default AddProduct;
