import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const UserMenu = ({ onOpenSettings }) => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) return null;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div style={{ position: 'relative' }}>
      {/* User Avatar Button */}
      <button
        onClick={toggleMenu}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          outline: 'none',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = '#3b82f6';
          e.target.style.backgroundColor = '#f8fafc';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = '#e5e7eb';
          e.target.style.backgroundColor = 'white';
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>{user.avatar}</span>
        <div style={{ textAlign: 'left' }}>
          <div style={{ 
            fontSize: '0.9rem', 
            fontWeight: '600', 
            color: '#374151',
            lineHeight: '1.2'
          }}>
            {user.name}
          </div>
          <div style={{ 
            fontSize: '0.8rem', 
            color: '#6b7280',
            lineHeight: '1.2'
          }}>
            {user.role}
          </div>
        </div>
        <span style={{ 
          fontSize: '0.8rem', 
          color: '#9ca3af',
          marginLeft: '4px',
          transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease'
        }}>
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          marginTop: '8px',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          minWidth: '220px',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* User Info Section */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #f3f4f6',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '2rem' }}>{user.avatar}</span>
              <div>
                <div style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: '#374151',
                  marginBottom: '2px'
                }}>
                  {user.name}
                </div>
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  {user.email}
                </div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: '#9ca3af'
                }}>
                  {user.role}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div style={{ padding: '8px 0' }}>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenSettings();
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <span>⚙️</span>
              Settings
            </button>
            
            <button
              onClick={() => {
                setIsMenuOpen(false);
                // Add help functionality here
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <span>❓</span>
              Help & Support
            </button>

            <div style={{ 
              height: '1px', 
              backgroundColor: '#f3f4f6', 
              margin: '8px 0' 
            }}></div>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                signOut();
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <span>🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default UserMenu;
