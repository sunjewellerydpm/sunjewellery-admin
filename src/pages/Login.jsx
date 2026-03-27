import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            if (email === import.meta.env.VITE_ADMIN_EMAIL && password === import.meta.env.VITE_ADMIN_PASSWORD) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('adminKey', import.meta.env.VITE_ADMIN_KEY);
                navigate('/admindashboard');
            } else {
                setError('Invalid email or password. Please try again.');
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: '#f5f5f5'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '420px',
                padding: '2.5rem'
            }}>
                {/* Logo/Brand */}
                <div style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <img src="https://res.cloudinary.com/dktx1ebxg/image/upload/v1768282931/logo_ibjz9b.png" alt="logo" className='h-24 mx-auto' />

                    <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                        Admin Dashboard
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 'var(--radius)',
                        color: 'var(--destructive)',
                        fontSize: '0.875rem',
                        marginBottom: '1.5rem'
                    }}>
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="input"
                            placeholder="example@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{
                            width: '100%',
                            marginTop: '1rem',
                            padding: '0.875rem'
                        }}
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin" style={{
                                    display: 'inline-block',
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid transparent',
                                    borderTopColor: 'currentColor',
                                    borderRadius: '50%'
                                }}></span>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>


            </div>
        </div>
    );
};

export default Login;
