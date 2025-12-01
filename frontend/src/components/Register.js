import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authAPI.registerStudent(formData);
      setSuccess('Registration successful! You can now login.');
      setFormData({ name: '', email: '', password: '' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1 }}></div>
      <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '20px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/edumanage-dark.svg" alt="EduManage" style={{ height: '40px', width: 'auto', marginBottom: '12px' }} />
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '6px', color: '#ffffff' }}>
            Student Registration
          </h1>
          <p style={{ color: '#e2e8f0', fontSize: '14px' }}>Create your student account</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              required
              className="form-input"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <input
              type="email"
              required
              className="form-input"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              required
              className="form-input"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {error && (
            <div className="error">{error}</div>
          )}

          {success && (
            <div className="success">{success}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-success"
            style={{ width: '100%', padding: '14px', fontSize: '16px', marginBottom: '16px' }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
            style={{ marginRight: '8px' }}
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: '#667eea', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;