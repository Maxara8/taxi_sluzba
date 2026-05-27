import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const getRoleLabel = () => {
    if (role === 'passenger') return 'Putnik';
    if (role === 'driver') return 'Vozač';
    if (role === 'admin') return 'Administrator';
    return '';
  };

  return (
    <header style={styles.header}>
      <div style={styles.inner}>

        {/* Logo */}
        <div style={styles.logoRow}>
          <span style={styles.logoEmoji}>🚖</span>
          <span style={styles.logoText}>TaxiServis</span>
          {role && <span style={styles.roleBadge}>{getRoleLabel()}</span>}
        </div>

        {/* Desna strana */}
        <button onClick={handleLogout} style={styles.logoutBtn}>
          → Odjavi se
        </button>

      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    padding: '12px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoEmoji: { fontSize: '28px' },
  logoText: {
    fontSize: '20px',
    color: '#fff',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  roleBadge: {
    backgroundColor: 'rgba(234,179,8,0.2)',
    color: '#fbbf24',
    border: '1px solid rgba(234,179,8,0.3)',
    borderRadius: '999px',
    padding: '3px 10px',
    fontSize: '12px',
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: "'Inter', sans-serif",
  },
};

export default Header;