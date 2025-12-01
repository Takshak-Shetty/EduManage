import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', age: '', gender: 'Male', 
    department: '', semester: '', enrollmentNumber: '', address: ''
  });
  const [marksForm, setMarksForm] = useState({
    enrollmentNumber: '',
    subjects: [{ name: '', internal: '', external: '', total: '' }]
  });
  const [searchEnrollment, setSearchEnrollment] = useState('');
  const [searchedMarks, setSearchedMarks] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updateForm, setUpdateForm] = useState({ subjects: [] });
  const [editStudentForm, setEditStudentForm] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingInModal, setEditingInModal] = useState(false);
  const [usnError, setUsnError] = useState('');

  const departmentCodes = {
    'AD': 'Artificial Intelligence & Data Science',
    'AM': 'Artificial Intelligence & Machine Learning',
    'BT': 'Biotechnology',
    'CV': 'Civil Engineering',
    'CC': 'Computer & Communication Engineering',
    'CS': 'Computer Science & Engineering',
    'CB': 'Computer Science & Engineering (Cyber Security)',
    'EE': 'Electrical & Electronics Engineering',
    'EC': 'Electronics & Communication Engineering',
    'VL': 'Electronics Engineering (VLSI Design & Technology)',
    'AC': 'Electronics & Communication (Advanced Communication Technology)',
    'IS': 'Information Science & Engineering',
    'ME': 'Mechanical Engineering',
    'RI': 'Robotics & Artificial Intelligence'
  };

  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents();
    }
  }, [activeTab]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getStudents();
      setStudents(response.data.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createStudent(formData);
      setShowForm(false);
      setFormData({
        name: '', email: '', age: '', gender: 'Male', 
        department: '', semester: '', enrollmentNumber: '', address: ''
      });
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating student');
    }
  };

  const handleDeleteStudent = async (enrollmentNumber) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await adminAPI.deleteStudent(enrollmentNumber);
        fetchStudents();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting student');
      }
    }
  };

  const handleCreateMarks = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createMarks(marksForm);
      setMarksForm({
        enrollmentNumber: '',
        subjects: [{ name: '', internal: '', external: '', total: '' }]
      });
      alert('Marks created successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating marks');
    }
  };

  const handleSearchMarks = async () => {
    if (!searchEnrollment) return;
    try {
      const response = await adminAPI.getMarks(searchEnrollment);
      setSearchedMarks(response.data.data);
      setUpdateForm({ subjects: response.data.data.subjects });
      setEditMode(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Marks not found');
      setSearchedMarks(null);
    }
  };

  const addSubject = () => {
    setMarksForm({
      ...marksForm,
      subjects: [...marksForm.subjects, { name: '', internal: '', external: '', total: '' }]
    });
  };

  const removeSubject = (index) => {
    const updatedSubjects = marksForm.subjects.filter((_, i) => i !== index);
    setMarksForm({ ...marksForm, subjects: updatedSubjects });
  };

  const updateSubject = (index, field, value) => {
    const updatedSubjects = marksForm.subjects.map((subject, i) => {
      if (i === index) {
        const updatedSubject = { ...subject, [field]: value };
        if (field === 'internal' || field === 'external') {
          const internal = field === 'internal' ? parseInt(value) || 0 : parseInt(updatedSubject.internal) || 0;
          const external = field === 'external' ? parseInt(value) || 0 : parseInt(updatedSubject.external) || 0;
          updatedSubject.total = internal + external;
        }
        return updatedSubject;
      }
      return subject;
    });
    setMarksForm({ ...marksForm, subjects: updatedSubjects });
  };

  const updateEditSubject = (index, field, value) => {
    const updatedSubjects = updateForm.subjects.map((subject, i) => {
      if (i === index) {
        const updatedSubject = { ...subject, [field]: value };
        if (field === 'internal' || field === 'external') {
          const internal = field === 'internal' ? parseInt(value) || 0 : parseInt(updatedSubject.internal) || 0;
          const external = field === 'external' ? parseInt(value) || 0 : parseInt(updatedSubject.external) || 0;
          updatedSubject.total = internal + external;
        }
        return updatedSubject;
      }
      return subject;
    });
    setUpdateForm({ ...updateForm, subjects: updatedSubjects });
  };

  const handleUpdateMarks = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateMarks(searchEnrollment, updateForm);
      setEditMode(false);
      handleSearchMarks();
      alert('Marks updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating marks');
    }
  };

  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
  };

  const closeStudentDetails = () => {
    setSelectedStudent(null);
    setEditingInModal(false);
  };

  const handleEditInModal = () => {
    setEditStudentForm(selectedStudent);
    setEditingInModal(true);
  };

  const handleUpdateInModal = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateStudent(selectedStudent.enrollmentNumber, editStudentForm);
      setEditingInModal(false);
      setSelectedStudent(editStudentForm);
      fetchStudents();
      alert('Student updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating student');
    }
  };

  const cancelModalEdit = () => {
    setEditingInModal(false);
    setEditStudentForm({});
  };

  const validateUSN = (usn) => {
    const upperUSN = usn.toUpperCase();
    const usnPattern = /^NNM(\d{2})([A-Z]{2})(\d{3})$/;
    const match = upperUSN.match(usnPattern);
    
    if (!match) {
      return { valid: false, error: 'Invalid USN format. Use: NNM<YY><DEPT><ROLL>' };
    }
    
    const [, year, deptCode, roll] = match;
    const department = departmentCodes[deptCode];
    
    if (!department) {
      return { valid: false, error: 'Invalid department code' };
    }
    
    return {
      valid: true,
      usn: upperUSN,
      admissionYear: `20${year}`,
      department,
      rollNumber: roll
    };
  };

  const handleUSNChange = (value) => {
    const upperValue = value.toUpperCase();
    setFormData({ ...formData, enrollmentNumber: upperValue });
    
    if (value.length === 0) {
      setUsnError('');
      return;
    }
    
    if (value.length < 10) {
      setUsnError('');
      return;
    }
    
    const result = validateUSN(value);
    
    if (result.valid) {
      setFormData({
        ...formData,
        enrollmentNumber: result.usn,
        department: result.department
      });
      setUsnError('');
    } else {
      setUsnError(result.error);
    }
  };



  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <nav className="nav">
        <div className="container">
          <div className="nav-content">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/edumanage-dark.svg" alt="EduManage" style={{ height: '36px', width: 'auto' }} />
              <div style={{ marginLeft: '20px', paddingLeft: '20px', borderLeft: '1px solid #475569' }}>
                <h1 className="nav-title" style={{ color: '#e2e8f0', margin: 0, fontSize: '18px' }}>Admin Dashboard</h1>
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
        <div className="tabs" style={{ borderBottom: '1px solid #475569' }}>
          <button
            onClick={() => setActiveTab('students')}
            className={`tab ${activeTab === 'students' ? 'active' : ''}`}
            style={{ color: activeTab === 'students' ? '#667eea' : '#94a3b8' }}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`tab ${activeTab === 'marks' ? 'active' : ''}`}
            style={{ color: activeTab === 'marks' ? '#667eea' : '#94a3b8' }}
          >
            Marks
          </button>
        </div>

        {activeTab === 'students' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#e2e8f0' }}>Students Management</h2>
              <button
                onClick={() => {
                  if (showForm) {
                    setFormData({
                      name: '', email: '', age: '', gender: 'Male', 
                      department: '', semester: '', enrollmentNumber: '', address: ''
                    });
                    setUsnError('');
                  }
                  setShowForm(!showForm);
                }}
                className="btn btn-primary"
              >
                {showForm ? 'Cancel' : 'Add Student'}
              </button>
            </div>

            {showForm && (
              <div className="card" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#e2e8f0' }}>Add New Student</h3>
                <form onSubmit={handleCreateStudent}>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        className="form-input"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        placeholder="Email Address"
                        required
                        className="form-input"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="number"
                        placeholder="Age"
                        required
                        min="1"
                        className="form-input"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <select
                        className="form-input"
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Enrollment Number (e.g., NNM21CS001)"
                        required
                        className="form-input"
                        value={formData.enrollmentNumber}
                        onChange={(e) => handleUSNChange(e.target.value)}
                      />
                      {usnError && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{usnError}</div>}
                    </div>
                    <div className="form-group">
                      <input
                        type="number"
                        placeholder="Semester"
                        required
                        min="1"
                        max="8"
                        className="form-input"
                        value={formData.semester}
                        onChange={(e) => setFormData({...formData, semester: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <select
                      className="form-input"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                      <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                      <option value="Biotechnology">Biotechnology</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Computer & Communication Engineering">Computer & Communication Engineering</option>
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Computer Science & Engineering (Cyber Security)">Computer Science & Engineering (Cyber Security)</option>
                      <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                      <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                      <option value="Electronics Engineering (VLSI Design & Technology)">Electronics Engineering (VLSI Design & Technology)</option>
                      <option value="Electronics & Communication (Advanced Communication Technology)">Electronics & Communication (Advanced Communication Technology)</option>
                      <option value="Information Science & Engineering">Information Science & Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Robotics & Artificial Intelligence">Robotics & Artificial Intelligence</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Address"
                      required
                      className="form-input"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
                    Create Student
                  </button>
                </form>
              </div>
            )}

            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Enrollment</th>
                  <th>Department</th>
                  <th>Semester</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="loading">Loading students...</td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No students found</td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student._id} style={{ cursor: 'pointer' }} onClick={() => viewStudentDetails(student)}>
                      <td style={{ fontWeight: '600', color: '#667eea' }}>{student.name}</td>
                      <td>{student.enrollmentNumber}</td>
                      <td>{student.department}</td>
                      <td style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{student.semester}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStudent(student.enrollmentNumber);
                          }}
                          title="Delete Student"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '24px',
                            height: '24px',
                            opacity: '0.6'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#fef2f2';
                            e.target.style.color = '#dc2626';
                            e.target.style.opacity = '1';
                            e.target.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#ef4444';
                            e.target.style.opacity = '0.6';
                            e.target.style.transform = 'scale(1)';
                          }}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {selectedStudent && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div className="card" style={{ background: '#1e293b', border: '1px solid #334155', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#e2e8f0', margin: 0 }}>Student Details</h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {!editingInModal && (
                        <button onClick={handleEditInModal} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                          Edit
                        </button>
                      )}
                      <button onClick={closeStudentDetails} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>×</button>
                    </div>
                  </div>
                  {editingInModal ? (
                    <form onSubmit={handleUpdateInModal}>
                      <div className="grid grid-2" style={{ gap: '16px' }}>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Full Name</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            value={editStudentForm.name || ''}
                            onChange={(e) => setEditStudentForm({...editStudentForm, name: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Email Address</label>
                          <input
                            type="email"
                            required
                            className="form-input"
                            value={editStudentForm.email || ''}
                            onChange={(e) => setEditStudentForm({...editStudentForm, email: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Age</label>
                          <input
                            type="number"
                            required
                            min="1"
                            className="form-input"
                            value={editStudentForm.age || ''}
                            onChange={(e) => setEditStudentForm({...editStudentForm, age: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Gender</label>
                          <select
                            className="form-input"
                            value={editStudentForm.gender || 'Male'}
                            onChange={(e) => setEditStudentForm({...editStudentForm, gender: e.target.value})}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Department</label>
                          <select
                            className="form-input"
                            value={editStudentForm.department || ''}
                            onChange={(e) => setEditStudentForm({...editStudentForm, department: e.target.value})}
                            required
                          >
                            <option value="">Select Department</option>
                            <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                            <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                            <option value="Biotechnology">Biotechnology</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Computer & Communication Engineering">Computer & Communication Engineering</option>
                            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                            <option value="Computer Science & Engineering (Cyber Security)">Computer Science & Engineering (Cyber Security)</option>
                            <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                            <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                            <option value="Electronics Engineering (VLSI Design & Technology)">Electronics Engineering (VLSI Design & Technology)</option>
                            <option value="Electronics & Communication (Advanced Communication Technology)">Electronics & Communication (Advanced Communication Technology)</option>
                            <option value="Information Science & Engineering">Information Science & Engineering</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Robotics & Artificial Intelligence">Robotics & Artificial Intelligence</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Current Semester</label>
                          <input
                            type="number"
                            required
                            min="1"
                            max="8"
                            className="form-input"
                            value={editStudentForm.semester || ''}
                            onChange={(e) => setEditStudentForm({...editStudentForm, semester: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Address</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          value={editStudentForm.address || ''}
                          onChange={(e) => setEditStudentForm({...editStudentForm, address: e.target.value})}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <button type="submit" className="btn btn-success" style={{ flex: 1 }}>
                          Update Student
                        </button>
                        <button type="button" onClick={cancelModalEdit} className="btn btn-danger" style={{ flex: 1 }}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-2" style={{ gap: '24px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Full Name</label>
                        <p style={{ fontSize: '16px', fontWeight: '500', color: '#e2e8f0', margin: 0 }}>{selectedStudent.name}</p>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Email Address</label>
                        <p style={{ fontSize: '16px', color: '#cbd5e1', margin: 0 }}>{selectedStudent.email}</p>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Enrollment Number</label>
                        <p style={{ fontSize: '16px', fontWeight: '500', color: '#667eea', margin: 0 }}>{selectedStudent.enrollmentNumber}</p>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Department</label>
                        <p style={{ fontSize: '16px', color: '#cbd5e1', margin: 0 }}>{selectedStudent.department}</p>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Current Semester</label>
                        <p style={{ fontSize: '16px', color: '#cbd5e1', margin: 0 }}>{selectedStudent.semester}</p>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Age</label>
                        <p style={{ fontSize: '16px', color: '#cbd5e1', margin: 0 }}>{selectedStudent.age} years</p>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Gender</label>
                        <p style={{ fontSize: '16px', color: '#cbd5e1', margin: 0 }}>{selectedStudent.gender}</p>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Registration Date</label>
                        <p style={{ fontSize: '16px', color: '#cbd5e1', margin: 0 }}>{new Date(selectedStudent.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Address</label>
                        <p style={{ fontSize: '16px', color: '#cbd5e1', margin: 0 }}>{selectedStudent.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'marks' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#e2e8f0' }}>Marks Management</h2>
            
            <div className="card" style={{ background: '#1e293b', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#e2e8f0' }}>Add Student Marks</h3>
              <form onSubmit={handleCreateMarks}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Enrollment Number"
                    required
                    className="form-input"
                    value={marksForm.enrollmentNumber}
                    onChange={(e) => setMarksForm({...marksForm, enrollmentNumber: e.target.value})}
                  />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#e2e8f0' }}>Subjects</h4>
                  {marksForm.subjects.map((subject, index) => (
                    <div key={index} style={{ marginBottom: '12px', padding: '12px', border: '1px solid #475569', borderRadius: '8px', background: '#334155', position: 'relative' }}>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeSubject(index)}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#fef2f2';
                            e.target.style.color = '#dc2626';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#ef4444';
                          }}
                        >
                          ×
                        </button>
                      )}
                      <div className="grid grid-2">
                        <input
                          type="text"
                          placeholder="Subject Name"
                          className="form-input"
                          value={subject.name}
                          onChange={(e) => updateSubject(index, 'name', e.target.value)}
                        />
                        <input
                          type="number"
                                          placeholder="Internal Marks"
                          className="form-input"
                          value={subject.internal}
                          onChange={(e) => updateSubject(index, 'internal', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="External Marks"
                          className="form-input"
                          value={subject.external}
                          onChange={(e) => updateSubject(index, 'external', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Total Marks"
                          className="form-input"
                          value={subject.total}
                          onChange={(e) => updateSubject(index, 'total', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSubject}
                    className="btn btn-primary"
                    style={{ marginRight: '8px' }}
                  >
                    Add Subject
                  </button>
                </div>
                
                <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
                  Create Marks
                </button>
              </form>
            </div>
            
            <div className="card" style={{ background: '#1e293b', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#e2e8f0' }}>Search Student Marks</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Enter Enrollment Number"
                  className="form-input"
                  value={searchEnrollment}
                  onChange={(e) => setSearchEnrollment(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  onClick={handleSearchMarks}
                  className="btn btn-primary"
                >
                  Search
                </button>
              </div>
              
              {searchedMarks && (
                <div style={{ marginTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#e2e8f0' }}>Student Marks</h4>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="btn btn-primary"
                    >
                      {editMode ? 'Cancel' : 'Edit'}
                    </button>
                  </div>
                  
                  <div className="grid grid-3" style={{ marginBottom: '24px' }}>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                      <div className="stat-value">{searchedMarks.percentage}%</div>
                      <div className="stat-label">Percentage</div>
                    </div>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                      <div className="stat-value">{searchedMarks.grade}</div>
                      <div className="stat-label">Grade</div>
                    </div>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                      <div className="stat-value">{searchedMarks.status === 'pass' ? 'PASS' : 'FAIL'}</div>
                      <div className="stat-label">{searchedMarks.status.toUpperCase()}</div>
                    </div>
                  </div>
                  
                  {editMode ? (
                    <form onSubmit={handleUpdateMarks}>
                      <div style={{ marginBottom: '16px' }}>
                        {updateForm.subjects.map((subject, index) => (
                          <div key={index} style={{ marginBottom: '20px', padding: '16px', border: '1px solid #475569', borderRadius: '8px', background: '#334155' }}>
                            <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#e2e8f0' }}>Subject {index + 1}</h5>
                            <div className="grid grid-2" style={{ gap: '12px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Subject Name</label>
                                <input
                                  type="text"
                                  placeholder="Subject Name"
                                  className="form-input"
                                  value={subject.name}
                                  onChange={(e) => updateEditSubject(index, 'name', e.target.value)}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Internal Marks (out of 20)</label>
                                <input
                                  type="number"
                                  placeholder="Internal Marks"
                                  className="form-input"
                                  value={subject.internal}
                                  onChange={(e) => updateEditSubject(index, 'internal', e.target.value)}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>External Marks (out of 80)</label>
                                <input
                                  type="number"
                                  placeholder="External Marks"
                                  className="form-input"
                                  value={subject.external}
                                  onChange={(e) => updateEditSubject(index, 'external', e.target.value)}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>Total Marks</label>
                                <input
                                  type="number"
                                  placeholder="Total Marks"
                                  className="form-input"
                                  value={subject.total}
                                  onChange={(e) => updateEditSubject(index, 'total', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
                        Update Marks
                      </button>
                    </form>
                  ) : (
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
                        {searchedMarks.subjects.map((subject, index) => (
                          <tr key={index}>
                            <td style={{ fontWeight: '600' }}>{subject.name}</td>
                            <td>{subject.internal}</td>
                            <td>{subject.external}</td>
                            <td style={{ fontWeight: '600', color: '#667eea' }}>{subject.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;