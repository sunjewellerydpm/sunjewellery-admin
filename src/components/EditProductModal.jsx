import React, { useState } from 'react';

const EditProductModal = ({ product, onClose, onSave }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: product.id || '',
        name: product.name || '',
        images: Array.isArray(product.images) ? product.images.join(', ') : '',
        price: product.price || '',
        discountPrice: product.discountPrice || '',
        category: product.category || '',
        createdAt: product.createdAt || new Date().toISOString().split('T')[0],
        description: product.description || '',
        weight: product.weight || '',
        karat: product.karat || '22K',
        product_code: product.product_code || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const productData = {
            ...formData,
            images: formData.images.split(',').map(url => url.trim()).filter(Boolean),
            price: parseInt(formData.price) || 0,
            discountPrice: parseInt(formData.discountPrice) || 0
        };

        await onSave(productData);
        setLoading(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '640px' }}
            >
                <div className="modal-header">
                    <h2 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                        Edit Product
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                        Update the product details below
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {/* Row 1: ID and Product Code */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="label" htmlFor="edit-id">Product ID</label>
                                <input
                                    type="text"
                                    id="edit-id"
                                    name="id"
                                    className="input"
                                    value={formData.id}
                                    onChange={handleChange}
                                    disabled
                                    style={{ opacity: 0.6 }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label" htmlFor="edit-product_code">Product Code</label>
                                <input
                                    type="text"
                                    id="edit-product_code"
                                    name="product_code"
                                    className="input"
                                    value={formData.product_code}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 2: Name */}
                        <div className="form-group">
                            <label className="label" htmlFor="edit-name">Product Name</label>
                            <input
                                type="text"
                                id="edit-name"
                                name="name"
                                className="input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Row 3: Price and Discount Price */}
                        {/* <div className="form-row">
                            <div className="form-group">
                                <label className="label" htmlFor="edit-price">Price (₹)</label>
                                <input
                                    type="number"
                                    id="edit-price"
                                    name="price"
                                    className="input"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="label" htmlFor="edit-discountPrice">Discount Price (₹)</label>
                                <input
                                    type="number"
                                    id="edit-discountPrice"
                                    name="discountPrice"
                                    className="input"
                                    value={formData.discountPrice}
                                    onChange={handleChange}
                                />
                            </div>
                        </div> */}

                        {/* Row 4: Category and Karat */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="label" htmlFor="edit-category">Category</label>
                                <select
                                    id="edit-category"
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
                                <label className="label" htmlFor="edit-karat">Karat</label>
                                <select
                                    id="edit-karat"
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
                            <label className="label" htmlFor="edit-weight">Weight</label>
                            <input
                                type="text"
                                id="edit-weight"
                                name="weight"
                                className="input"
                                value={formData.weight}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Row 6: Images */}
                        {/* <div className="form-group">
                            <label className="label" htmlFor="edit-images">Image URLs</label>
                            <input
                                type="text"
                                id="edit-images"
                                name="images"
                                className="input"
                                placeholder="Comma-separated URLs"
                                value={formData.images}
                                onChange={handleChange}
                            />
                        </div> */}

                        {/* Row 7: Description */}
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="label" htmlFor="edit-description">Description</label>
                            <textarea
                                id="edit-description"
                                name="description"
                                className="input textarea"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
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
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
