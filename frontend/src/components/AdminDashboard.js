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
  const [searchStudentEnrollment, setSearchStudentEnrollment] = useState('');
  const [searchedStudent, setSearchedStudent] = useState(null);
  const [editStudentMode, setEditStudentMode] = useState(false);
  const [editStudentForm, setEditStudentForm] = useState({});

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

  const updateSubject = (index, field, value) => {
    const updatedSubjects = marksForm.subjects.map((subject, i) => {
      if (i === index) {
        const updatedSubject = { ...subject, [field]: value };
        // Auto-calculate total when internal or external changes
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
        // Auto-calculate total when internal or external changes
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
      handleSearchMarks(); // Refresh data
      alert('Marks updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating marks');
    }
  };

  const handleSearchStudent = async () => {
    if (!searchStudentEnrollment) return;
    try {
      const response = await adminAPI.getStudent(searchStudentEnrollment);
      setSearchedStudent(response.data.data);
      setEditStudentForm(response.data.data);
      setEditStudentMode(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Student not found');
      setSearchedStudent(null);
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateStudent(searchStudentEnrollment, editStudentForm);
      setEditStudentMode(false);
      handleSearchStudent();
      alert('Student updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating student');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav className="nav">
        <div className="container">
          <div className="nav-content">
            <div>
              <h1 className="nav-title">Admin Dashboard</h1>
            </div>
            <div className="nav-user">
              <span style={{ color: '#64748b' }}>Welcome, <strong>{user.name}</strong></span>
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
            onClick={() => setActiveTab('students')}
            className={`tab ${activeTab === 'students' ? 'active' : ''}`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`tab ${activeTab === 'marks' ? 'active' : ''}`}
          >
            Marks
          </button>
        </div>

        {activeTab === 'students' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Students Management</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn btn-primary"
              >
                {showForm ? 'Cancel' : 'Add Student'}
              </button>
            </div>

            {showForm && (
              <div className="card">
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Add New Student</h3>
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
                        placeholder="Department"
                        required
                        className="form-input"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="number"
                        placeholder="Semester"
                        required
                        className="form-input"
                        value={formData.semester}
                        onChange={(e) => setFormData({...formData, semester: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Enrollment Number"
                      required
                      className="form-input"
                      value={formData.enrollmentNumber}
                      onChange={(e) => setFormData({...formData, enrollmentNumber: e.target.value})}
                    />
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="loading">Loading students...</td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No students found</td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student._id}>
                      <td style={{ fontWeight: '600' }}>{student.name}</td>
                      <td>{student.enrollmentNumber}</td>
                      <td>{student.department}</td>
                      <td>{student.semester}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteStudent(student.enrollmentNumber)}
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {/* Search Student */}
            <div className="card">
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Search Student</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Enter Enrollment Number"
                  className="form-input"
                  value={searchStudentEnrollment}
                  onChange={(e) => setSearchStudentEnrollment(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  onClick={handleSearchStudent}
                  className="btn btn-primary"
                >
                  Search
                </button>
              </div>
              
              {searchedStudent && (
                <div style={{ marginTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600' }}>Student Details</h4>
                    <button
                      onClick={() => setEditStudentMode(!editStudentMode)}
                      className="btn btn-primary"
                    >
                      {editStudentMode ? 'Cancel' : 'Edit'}
                    </button>
                  </div>
                  {editStudentMode ? (
                    <form onSubmit={handleUpdateStudent}>
                      <div className="grid grid-2" style={{ gap: '16px' }}>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Full Name</label>
                          <input
                            type="text"
                            className="form-input"
                            value={editStudentForm.name}
                            onChange={(e) => setEditStudentForm({...editStudentForm, name: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Email Address</label>
                          <input
                            type="email"
                            className="form-input"
                            value={editStudentForm.email}
                            onChange={(e) => setEditStudentForm({...editStudentForm, email: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Age</label>
                          <input
                            type="number"
                            className="form-input"
                            value={editStudentForm.age}
                            onChange={(e) => setEditStudentForm({...editStudentForm, age: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Gender</label>
                          <select
                            className="form-input"
                            value={editStudentForm.gender}
                            onChange={(e) => setEditStudentForm({...editStudentForm, gender: e.target.value})}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Department</label>
                          <input
                            type="text"
                            className="form-input"
                            value={editStudentForm.department}
                            onChange={(e) => setEditStudentForm({...editStudentForm, department: e.target.value})}
                          />
                        </div>
                        <div className="form-group">
                          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Current Semester</label>
                          <input
                            type="number"
                            className="form-input"
                            value={editStudentForm.semester}
                            onChange={(e) => setEditStudentForm({...editStudentForm, semester: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Address</label>
                        <input
                          type="text"
                          className="form-input"
                          value={editStudentForm.address}
                          onChange={(e) => setEditStudentForm({...editStudentForm, address: e.target.value})}
                        />
                      </div>
                      <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
                        Update Student
                      </button>
                    </form>
                  ) : (
                    <div className="grid grid-2" style={{ gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Full Name</label>
                      <p style={{ fontSize: '16px', fontWeight: '500' }}>{searchedStudent.name}</p>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Email Address</label>
                      <p style={{ fontSize: '16px' }}>{searchedStudent.email}</p>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Enrollment Number</label>
                      <p style={{ fontSize: '16px', fontWeight: '500', color: '#667eea' }}>{searchedStudent.enrollmentNumber}</p>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Department</label>
                      <p style={{ fontSize: '16px' }}>{searchedStudent.department}</p>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Current Semester</label>
                      <p style={{ fontSize: '16px' }}>{searchedStudent.semester}</p>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Age</label>
                      <p style={{ fontSize: '16px' }}>{searchedStudent.age} years</p>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Address</label>
                      <p style={{ fontSize: '16px' }}>{searchedStudent.address}</p>
                    </div>
                  </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'marks' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Marks Management</h2>
            
            {/* Create Marks Form */}
            <div className="card">
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Add Student Marks</h3>
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
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Subjects</h4>
                  {marksForm.subjects.map((subject, index) => (
                    <div key={index} className="grid grid-2" style={{ marginBottom: '12px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
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
            
            {/* Search Marks */}
            <div className="card">
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Search Student Marks</h3>
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
                    <h4 style={{ fontSize: '18px', fontWeight: '600' }}>Student Marks</h4>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="btn btn-primary"
                    >
                      {editMode ? 'Cancel' : 'Edit'}
                    </button>
                  </div>
                  
                  <div className="grid grid-3" style={{ marginBottom: '24px' }}>
                    <div className="stat-card">
                      <div className="stat-value">{searchedMarks.percentage}%</div>
                      <div className="stat-label">Percentage</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{searchedMarks.grade}</div>
                      <div className="stat-label">Grade</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">{searchedMarks.status === 'pass' ? 'PASS' : 'FAIL'}</div>
                      <div className="stat-label">{searchedMarks.status.toUpperCase()}</div>
                    </div>
                  </div>
                  
                  {editMode ? (
                    <form onSubmit={handleUpdateMarks}>
                      <div style={{ marginBottom: '16px' }}>
                        {updateForm.subjects.map((subject, index) => (
                          <div key={index} style={{ marginBottom: '20px', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                            <h5 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#334155' }}>Subject {index + 1}</h5>
                            <div className="grid grid-2" style={{ gap: '12px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Subject Name</label>
                                <input
                                  type="text"
                                  placeholder="Subject Name"
                                  className="form-input"
                                  value={subject.name}
                                  onChange={(e) => updateEditSubject(index, 'name', e.target.value)}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Internal Marks (out of 20)</label>
                                <input
                                  type="number"
                                  placeholder="Internal Marks"
                                  className="form-input"
                                  value={subject.internal}
                                  onChange={(e) => updateEditSubject(index, 'internal', e.target.value)}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>External Marks (out of 80)</label>
                                <input
                                  type="number"
                                  placeholder="External Marks"
                                  className="form-input"
                                  value={subject.external}
                                  onChange={(e) => updateEditSubject(index, 'external', e.target.value)}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Total Marks</label>
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