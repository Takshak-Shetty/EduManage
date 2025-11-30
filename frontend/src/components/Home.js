import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      {/* Header */}
      <header style={{ background: '#1e293b', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)', padding: '16px 0', borderBottom: '1px solid #334155' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              EduManage
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Login
            </button>
            <button onClick={() => navigate('/register')} className="btn btn-success">
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '80px 0' }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: '60px' }}>
            <div>
              <h2 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '24px', margin: '0 0 24px 0' }}>
                Student Record Management System
              </h2>
              <p style={{ fontSize: '20px', marginBottom: '40px', opacity: 0.9, lineHeight: 1.6 }}>
                Streamline academic administration with our comprehensive platform for managing student records, grades, and performance analytics.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                  onClick={() => navigate('/register')} 
                  style={{ background: 'white', color: '#667eea', padding: '16px 32px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Get Started
                </button>
                <button 
                  onClick={() => navigate('/login')} 
                  style={{ background: 'transparent', color: 'white', padding: '16px 32px', border: '2px solid white', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Sign In
                </button>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Students collaborating" 
                  style={{ width: '100%', maxWidth: '500px', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', transition: 'all 0.3s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 30px 60px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                  }}
                />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(102, 126, 234, 0.9)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', opacity: 0, transition: 'opacity 0.3s ease', pointerEvents: 'none' }}
                     onMouseEnter={(e) => e.target.style.opacity = '1'}
                     onMouseLeave={(e) => e.target.style.opacity = '0'}>
                  Collaborative Learning
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h3 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', color: '#e2e8f0' }}>
              Powerful Features
            </h3>
            <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
              Everything you need to manage student records efficiently and effectively.
            </p>
          </div>
          
          <div className="grid grid-3" style={{ gap: '32px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '32px', cursor: 'pointer', transition: 'all 0.3s ease' }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = 'translateY(-8px)';
                   e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                 }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                  alt="Student Management" 
                  style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.filter = 'brightness(0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.filter = 'brightness(1)';
                  }}
                />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease', color: 'white', fontWeight: 'bold' }}
                     onMouseEnter={(e) => e.target.style.opacity = '1'}
                     onMouseLeave={(e) => e.target.style.opacity = '0'}>
                  Manage
                </div>
              </div>
              <h4 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#e2e8f0' }}>
                Student Management
              </h4>
              <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                Comprehensive student profile management with enrollment tracking and personal information storage.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '32px', cursor: 'pointer', transition: 'all 0.3s ease' }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = 'translateY(-8px)';
                   e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                 }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                  alt="Grade Management" 
                  style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.filter = 'brightness(0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.filter = 'brightness(1)';
                  }}
                />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease', color: 'white', fontWeight: 'bold' }}
                     onMouseEnter={(e) => e.target.style.opacity = '1'}
                     onMouseLeave={(e) => e.target.style.opacity = '0'}>
                  Grade
                </div>
              </div>
              <h4 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#e2e8f0' }}>
                Grade Management
              </h4>
              <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                Efficient grade recording, calculation, and reporting with automated performance analytics.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '32px', cursor: 'pointer', transition: 'all 0.3s ease' }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = 'translateY(-8px)';
                   e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                 }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                  alt="Reports & Analytics" 
                  style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.filter = 'brightness(0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.filter = 'brightness(1)';
                  }}
                />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease', color: 'white', fontWeight: 'bold' }}
                     onMouseEnter={(e) => e.target.style.opacity = '1'}
                     onMouseLeave={(e) => e.target.style.opacity = '0'}>
                  Analyze
                </div>
              </div>
              <h4 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#e2e8f0' }}>
                Reports & Analytics
              </h4>
              <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                Generate detailed reports and gain insights into student performance and academic trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: '#1e293b', padding: '60px 0' }}>
        <div className="container">
          <div className="grid grid-3" style={{ gap: '32px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea', marginBottom: '8px' }}>
                99%
              </div>
              <p style={{ color: '#94a3b8', fontSize: '16px' }}>System Uptime</p>
            </div>
            <div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea', marginBottom: '8px' }}>
                24/7
              </div>
              <p style={{ color: '#94a3b8', fontSize: '16px' }}>Support Available</p>
            </div>
            <div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea', marginBottom: '8px' }}>
                100%
              </div>
              <p style={{ color: '#94a3b8', fontSize: '16px' }}>Data Security</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '60px 0' }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center', gap: '60px' }}>
            <div>
              <h3 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
                Ready to Get Started?
              </h3>
              <p style={{ fontSize: '18px', marginBottom: '32px', opacity: 0.9 }}>
                Join thousands of educational institutions using EduManage to streamline their academic operations.
              </p>
              <button 
                onClick={() => navigate('/register')} 
                style={{ background: 'white', color: '#667eea', padding: '16px 32px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
              >
                Start Free Trial
              </button>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Education technology" 
                  style={{ width: '100%', maxWidth: '400px', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', transition: 'all 0.3s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 30px 60px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                  }}
                />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255, 255, 255, 0.95)', color: '#667eea', padding: '12px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', opacity: 0, transition: 'opacity 0.3s ease', pointerEvents: 'none' }}
                     onMouseEnter={(e) => e.target.style.opacity = '1'}
                     onMouseLeave={(e) => e.target.style.opacity = '0'}>
                  Modern Technology
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1e293b', color: 'white', padding: '40px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>EduManage</h4>
            <p style={{ color: '#94a3b8' }}>Student Record Management System</p>
          </div>
          <div style={{ borderTop: '1px solid #334155', paddingTop: '24px', color: '#94a3b8', fontSize: '14px' }}>
            © 2025 EduManage. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;