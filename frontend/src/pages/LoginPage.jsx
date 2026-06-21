import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await loginUser({ email, password });

      // Cuvamo korisnika u localStorage
      localStorage.setItem('user', JSON.stringify(data));

      // Preusmeravamo na osnovu role
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'driver') navigate('/driver');
      else navigate('/passenger');

    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri prijavi');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError('');

    try {
      const { data } = await loginUser({ email: demoEmail, password: demoPassword });
      localStorage.setItem('user', JSON.stringify(data));

      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'driver') navigate('/driver');
      else navigate('/passenger');

    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri prijavi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.logoRow}>
          <span style={styles.logoEmoji}>🚖</span>
          <span style={styles.logoText}>TaxiServis</span>
        </div>

        <h2 style={styles.title}>Prijava</h2>
        <p style={styles.subtitle}>Unesite svoje podatke za pristup sistemu</p>

        {error && <p style={styles.error}>{error}</p>}

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

        <p style={styles.demoText}>Demo nalozi:</p>
        <div style={styles.demoButtons}>
          <button style={styles.btnOutline} onClick={() => handleDemoLogin('admin@taxi.com', 'admin123')}>
            Prijavi se kao Administrator
          </button>
          <button style={styles.btnOutline} onClick={() => handleDemoLogin('putnik@test.com', 'putnik123')}>
            Prijavi se kao Putnik
          </button>
          <button style={styles.btnOutline} onClick={() => handleDemoLogin('vozac@test.com', 'vozac123')}>
            Prijavi se kao Vozač
          </button>
        </div>

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
  logoEmoji: { fontSize: '36px' },
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
  },
  error: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '13px',
    marginBottom: '12px',
    textAlign: 'center',
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