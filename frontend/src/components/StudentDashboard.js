import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'profile') {
      fetchProfile();
    } else if (activeTab === 'scorecard') {
      fetchScorecard();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getProfile();
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScorecard = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getScorecard();
      setScorecard(response.data.data);
    } catch (error) {
      console.error('Error fetching scorecard:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add NITTE Logo PNG
    doc.addImage('/nitte-logo.png', 'PNG', 15, 10, 180, 30);
    
    // Academic Scorecard title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Academic Scorecard', 105, 50, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Student: ${profile?.name || user.name}`, 20, 60);
    doc.text(`Enrollment: ${profile?.enrollmentNumber || 'N/A'}`, 20, 70);
    doc.text(`Department: ${profile?.department || 'N/A'}`, 20, 80);
    
    doc.text(`Percentage: ${scorecard.marks.percentage}%`, 120, 60);
    doc.text(`Grade: ${scorecard.marks.grade}`, 120, 70);
    doc.text(`Status: ${scorecard.marks.status.toUpperCase()}`, 120, 80);
    
    const tableData = scorecard.marks.subjects.map(subject => [
      subject.name,
      subject.internal,
      subject.external,
      subject.total
    ]);
    
    autoTable(doc, {
      head: [['Subject', 'Internal', 'External', 'Total']],
      body: tableData,
      startY: 90,
      theme: 'grid',
      headStyles: {
        fillColor: [39, 53, 165], // NITTE Blue
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 5
      }
    });
    
    doc.save(`${profile?.name || user.name}_Scorecard.pdf`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <nav className="nav">
        <div className="container">
          <div className="nav-content">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/edumanage-dark.svg" alt="EduManage" style={{ height: '36px', width: 'auto' }} />
              <div style={{ marginLeft: '20px', paddingLeft: '20px', borderLeft: '1px solid #475569' }}>
                <h1 className="nav-title" style={{ margin: 0, fontSize: '18px' }}>Student Portal</h1>
              </div>
            </div>
            <div className="nav-user">
              <span style={{ color: '#cbd5e1' }}>Welcome, <strong>{user.name}</strong></span>
              <button onClick={logout} className="btn btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        <div className="tabs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('scorecard')}
            className={`tab ${activeTab === 'scorecard' ? 'active' : ''}`}
          >
            Scorecard
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="card">
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#e2e8f0' }}>Student Profile</h3>
            {loading ? (
              <div className="loading">Loading profile...</div>
            ) : profile ? (
              <div className="grid grid-2" style={{ gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Full Name</label>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#e2e8f0' }}>{profile.name}</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Email Address</label>
                  <p style={{ fontSize: '16px', color: '#cbd5e1' }}>{profile.email}</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Enrollment Number</label>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#667eea' }}>{profile.enrollmentNumber}</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Department</label>
                  <p style={{ fontSize: '16px', color: '#cbd5e1' }}>{profile.department}</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Current Semester</label>
                  <p style={{ fontSize: '16px', color: '#cbd5e1' }}>{profile.semester}</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Age</label>
                  <p style={{ fontSize: '16px', color: '#cbd5e1' }}>{profile.age} years</p>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Address</label>
                  <p style={{ fontSize: '16px', color: '#cbd5e1' }}>{profile.address}</p>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No profile data found</div>
            )}
          </div>
        )}

        {activeTab === 'scorecard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '600', margin: 0, color: '#e2e8f0' }}>Academic Scorecard</h3>
              {scorecard && (
                <button onClick={downloadPDF} className="btn btn-success">
                  Download PDF
                </button>
              )}
            </div>
            {loading ? (
              <div className="loading">Loading scorecard...</div>
            ) : scorecard ? (
              <div>
                <div className="grid grid-3" style={{ marginBottom: '32px' }}>
                  <div className="stat-card">
                    <div className="stat-value">{scorecard.marks.percentage}%</div>
                    <div className="stat-label">Percentage</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{scorecard.marks.grade}</div>
                    <div className="stat-label">Grade</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{scorecard.marks.status === 'pass' ? 'PASS' : 'FAIL'}</div>
                    <div className="stat-label">{scorecard.marks.status.toUpperCase()}</div>
                  </div>
                </div>

                <div className="card">
                  <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#e2e8f0' }}>Subject-wise Marks</h4>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Internal</th>
                        <th>External</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scorecard.marks.subjects.map((subject, index) => (
                        <tr key={index}>
                          <td style={{ fontWeight: '600' }}>{subject.name}</td>
                          <td>{subject.internal}</td>
                          <td>{subject.external}</td>
                          <td style={{ fontWeight: '600', color: '#667eea' }}>{subject.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="card">
                <div style={{ textAlign: 'center', padding: '40px' }}>

                  <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#e2e8f0' }}>No Scorecard Available</h4>
                  <p style={{ color: '#94a3b8' }}>Your marks haven't been uploaded yet. Please contact your administrator.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;