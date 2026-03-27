import React, { useState } from 'react';

const DeleteConfirmModal = ({ product, onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirm();
        setLoading(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '420px' }}
            >
                <div className="modal-body" style={{ textAlign: 'center', padding: '2rem' }}>
                    {/* Warning Icon */}
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--destructive)"
                            strokeWidth="2"
                        >
                            <path d="M3 6h18" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                    </div>

                    <h2 className="font-serif" style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem'
                    }}>
                        Delete Product
                    </h2>

                    <p style={{
                        color: 'var(--muted-foreground)',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem'
                    }}>
                        Are you sure you want to delete this product?
                    </p>

                    <p style={{
                        fontWeight: '500',
                        marginBottom: '1rem'
                    }}>
                        "{product.name}"
                    </p>

                    <p style={{
                        color: 'var(--muted-foreground)',
                        fontSize: '0.75rem',
                        padding: '0.75rem',
                        backgroundColor: 'var(--secondary)',
                        borderRadius: 'var(--radius)'
                    }}>
                        This action cannot be undone. The product will be permanently removed from your inventory.
                    </p>
                </div>

                <div className="modal-footer" style={{ justifyContent: 'center' }}>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-destructive"
                        onClick={handleConfirm}
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
                                Deleting...
                            </>
                        ) : (
                            'Delete Product'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
