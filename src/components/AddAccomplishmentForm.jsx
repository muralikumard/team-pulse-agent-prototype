import React from 'react';

const AddAccomplishmentForm = ({
  title,
  setTitle,
  date,
  setDate,
  category,
  setCategory,
  description,
  setDescription,
  contributors,
  setContributors,
  onSubmit,
  onCancel,
  isEditing = false,
  submitButtonText = null
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!title || !date || !category || !description) {
      alert('All fields are required');
      return;
    }
    
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 20 }}>
        <label 
          htmlFor="modal-title" 
          style={{ 
            display: 'block', 
            marginBottom: 8, 
            fontWeight: '500',
            color: '#374151',
            fontSize: '0.95rem'
          }}
        >
          Title *
        </label>
        <input
          id="modal-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            border: '1px solid #d1d5db',
            fontSize: '1rem',
            transition: 'all 0.2s ease',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          placeholder="e.g., Shipped Feature X"
          autoFocus
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <label 
          htmlFor="modal-date" 
          style={{ 
            display: 'block', 
            marginBottom: 8, 
            fontWeight: '500',
            color: '#374151',
            fontSize: '0.95rem'
          }}
        >
          Date *
        </label>
        <input
          id="modal-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            border: '1px solid #d1d5db',
            fontSize: '1rem',
            transition: 'all 0.2s ease',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <label 
          htmlFor="modal-category" 
          style={{ 
            display: 'block', 
            marginBottom: 8, 
            fontWeight: '500',
            color: '#374151',
            fontSize: '0.95rem'
          }}
        >
          Category *
        </label>
        <select
          id="modal-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            border: '1px solid #d1d5db',
            fontSize: '1rem',
            backgroundColor: 'white',
            transition: 'all 0.2s ease',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="Feature">Feature</option>
          <option value="Bug Fix">Bug Fix</option>
          <option value="Process">Process</option>
          <option value="Team">Team</option>
          <option value="Learning">Learning</option>
        </select>
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <label 
          htmlFor="modal-contributors" 
          style={{ 
            display: 'block', 
            marginBottom: 8, 
            fontWeight: '500',
            color: '#374151',
            fontSize: '0.95rem'
          }}
        >
          Contributors
        </label>
        <input
          id="modal-contributors"
          type="text"
          value={contributors}
          onChange={(e) => setContributors(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            border: '1px solid #d1d5db',
            fontSize: '1rem',
            transition: 'all 0.2s ease',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          placeholder="e.g., John Doe, Jane Smith"
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
      
      <div style={{ marginBottom: 24 }}>
        <label 
          htmlFor="modal-description" 
          style={{ 
            display: 'block', 
            marginBottom: 8, 
            fontWeight: '500',
            color: '#374151',
            fontSize: '0.95rem'
          }}
        >
          Description *
        </label>
        <textarea
          id="modal-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            border: '1px solid #d1d5db', 
            minHeight: 100,
            fontSize: '1rem',
            fontFamily: 'inherit',
            resize: 'vertical',
            transition: 'all 0.2s ease',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          placeholder="Briefly describe the accomplishment..."
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        justifyContent: 'flex-end',
        paddingTop: 16,
        borderTop: '1px solid #e5e7eb'
      }}>
        <button 
          type="button"
          onClick={onCancel}
          style={{ 
            backgroundColor: 'transparent',
            color: '#6b7280', 
            padding: '10px 20px', 
            border: '1px solid #d1d5db', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f9fafb';
            e.target.style.borderColor = '#9ca3af';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.borderColor = '#d1d5db';
          }}
        >
          Cancel
        </button>
        
        <button 
          type="submit" 
          style={{ 
            backgroundColor: isEditing ? '#2563eb' : '#16a34a',
            color: 'white', 
            padding: '10px 20px', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = isEditing ? '#1d4ed8' : '#15803d';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = isEditing ? '#2563eb' : '#16a34a';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
          }}
        >
          {submitButtonText || (isEditing ? 'Update Accomplishment' : 'Add Accomplishment')}
        </button>
      </div>
    </form>
  );
};

export default AddAccomplishmentForm;
