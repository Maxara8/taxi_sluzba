import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const TaxiIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="9" width="20" height="10" rx="2" fill="#eab308"/>
    <rect x="6" y="6" width="12" height="5" rx="1.5" fill="#eab308"/>
    <rect x="7" y="7" width="4" height="3" rx="0.5" fill="#1f2937"/>
    <rect x="13" y="7" width="4" height="3" rx="0.5" fill="#1f2937"/>
    <circle cx="6.5" cy="19.5" r="1.8" fill="#1f2937"/>
    <circle cx="17.5" cy="19.5" r="1.8" fill="#1f2937"/>
    <rect x="1" y="13" width="3" height="2" rx="0.5" fill="#fbbf24"/>
    <rect x="20" y="13" width="3" height="2" rx="0.5" fill="#fbbf24"/>
  </svg>
);

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Login:', email, password);
    setLoading(false);
  };

  const handleDemoLogin = (demoEmail, demoPassword, role) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    console.log('Demo login kao:', role);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoRow}>
            <span style={styles.logoEmoji}>🚖</span>
            <span style={styles.logoText}>TaxiServis</span>
        </div>

        <h2 style={styles.title}>Prijava</h2>
        <p style={styles.subtitle}>Unesite svoje podatke za pristup sistemu</p>

        {/* Forma */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="primer@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Lozinka</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.btnYellow} disabled={loading}>
            {loading ? 'Prijavljivanje...' : 'Prijavi se'}
          </button>
        </form>

        {/* Demo nalozi */}
        <p style={styles.demoText}>Demo nalozi:</p>
        <div style={styles.demoButtons}>
          <button style={styles.btnOutline} onClick={() => handleDemoLogin('admin@taxi.com', 'admin123', 'Administrator')}>
            Prijavi se kao Administrator
          </button>
          <button style={styles.btnOutline} onClick={() => handleDemoLogin('putnik@test.com', 'putnik123', 'Putnik')}>
            Prijavi se kao Putnik
          </button>
          <button style={styles.btnOutline} onClick={() => handleDemoLogin('vozac@test.com', 'vozac123', 'Vozač')}>
            Prijavi se kao Vozač
          </button>
        </div>

        {/* Linkovi */}
        <p style={styles.registerText}>
          Nemate nalog?{' '}
          <Link to="/register" style={styles.link}>Registrujte se</Link>
        </p>
        <p style={styles.registerText}>
          <Link to="/" style={styles.linkGray}>Povratak na početnu</Link>
        </p>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #111827, #1f2937, #111827)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  logoEmoji: {
    fontSize: '36px',
  },
  logoText: {
    fontSize: '24px',
    color: '#fff',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    margin: '0 0 4px',
    fontSize: '20px',
    fontWeight: '600',
  },
  subtitle: {
    color: '#9ca3af',
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '24px',
    fontWeight: '400',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#e5e7eb',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    color: '#fff',
    fontSize: '14px',
    marginBottom: '8px',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  btnYellow: {
    padding: '12px',
    backgroundColor: '#eab308',
    color: '#111',
    fontWeight: '700',
    fontSize: '15px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '4px',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.2px',
  },
  demoText: {
    color: '#9ca3af',
    fontSize: '13px',
    textAlign: 'center',
    margin: '20px 0 8px',
  },
  demoButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  btnOutline: {
    padding: '10px',
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    color: '#e5e7eb',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
    fontWeight: '500',
  },
  registerText: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '14px',
    color: '#9ca3af',
  },
  link: {
    color: '#eab308',
    textDecoration: 'none',
    fontWeight: '600',
  },
  linkGray: {
    color: '#9ca3af',
    textDecoration: 'none',
  },
};

export default LoginPage;