import React from 'react';
import { Map, MessageSquare } from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'comments';
  onTabChange: (tab: 'map' | 'comments') => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        gap: '1rem',
        margin: '0 auto',
        maxWidth: '1200px',
        width: '100%'
      }}>
        <button
          onClick={() => onTabChange('map')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            backgroundColor: activeTab === 'map' ? '#f3f4f6' : 'transparent',
            color: activeTab === 'map' ? '#2563eb' : '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Map size={20} />
          <span>Map View</span>
        </button>
        
        <button
          onClick={() => onTabChange('comments')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            backgroundColor: activeTab === 'comments' ? '#f3f4f6' : 'transparent',
            color: activeTab === 'comments' ? '#2563eb' : '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <MessageSquare size={20} />
          <span>Travel Comments</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 