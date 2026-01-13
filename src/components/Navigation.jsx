import React from 'react';

const Navigation = ({ 
  totalAccomplishments, 
  filteredAccomplishments, 
  searchTerm, 
  onClearFilters, 
  onScrollToForm, 
  onScrollToList,
  onScrollToSummary 
}) => {
  const hasFilters = searchTerm || filteredAccomplishments.length !== totalAccomplishments;

  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '12px 0',
      marginBottom: '20px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* Quick Navigation Links */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button
            onClick={onScrollToForm}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#3b82f6',
              fontSize: '0.9rem',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#eff6ff';
              e.target.style.color = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#3b82f6';
            }}
          >
            <span>➕</span>
            Add New
          </button>

          <button
            onClick={onScrollToList}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#3b82f6',
              fontSize: '0.9rem',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#eff6ff';
              e.target.style.color = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#3b82f6';
            }}
          >
            <span>📋</span>
            View List ({filteredAccomplishments})
          </button>

          <button
            onClick={onScrollToSummary}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#3b82f6',
              fontSize: '0.9rem',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#eff6ff';
              e.target.style.color = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#3b82f6';
            }}
          >
            <span>📊</span>
            Generate Summary
          </button>
        </div>

        {/* Status and Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Filter Status */}
          {hasFilters && (
            <div style={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              fontSize: '0.8rem',
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>🔍</span>
              {searchTerm ? `"${searchTerm}"` : 'Filtered'}
              <button
                onClick={onClearFilters}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#92400e',
                  cursor: 'pointer',
                  marginLeft: '4px',
                  fontSize: '0.8rem',
                  padding: '0 2px'
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Accomplishments Count */}
          <div style={{
            fontSize: '0.9rem',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>📈</span>
            {totalAccomplishments} Total
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
