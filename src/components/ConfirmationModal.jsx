import React from 'react';

const ConfirmationModal = ({ type, title, message, onClose }) => {
    const isSuccess = type === 'success';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '380px' }}
            >
                <div className="modal-body" style={{ textAlign: 'center', padding: '2rem' }}>
                    {/* Icon */}
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: isSuccess ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem'
                    }}>
                        {isSuccess ? (
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--success)"
                                strokeWidth="2"
                            >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        ) : (
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--destructive)"
                                strokeWidth="2"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                        )}
                    </div>

                    <h2 className="font-serif" style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem',
                        color: isSuccess ? 'var(--success)' : 'var(--destructive)'
                    }}>
                        {title}
                    </h2>

                    <p style={{
                        color: 'var(--muted-foreground)',
                        fontSize: '0.875rem'
                    }}>
                        {message}
                    </p>
                </div>

                <div className="modal-footer" style={{ justifyContent: 'center' }}>
                    <button
                        type="button"
                        className={`btn ${isSuccess ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={onClose}
                        style={{ minWidth: '120px' }}
                    >
                        {isSuccess ? 'Continue' : 'Close'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
