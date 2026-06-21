import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('passenger');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Lozinke se ne poklapaju');
      return;
    }

    if (password.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera');
      return;
    }

    setLoading(true);

    try {
      const { data } = await registerUser({ name, email, password, role });

      // Cuvamo korisnika u localStorage
      localStorage.setItem('user', JSON.stringify(data));

      // Preusmeravamo na osnovu role
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'driver') navigate('/driver');
      else navigate('/passenger');

    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri registraciji');
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

        <h2 style={styles.title}>Registracija</h2>
        <p style={styles.subtitle}>Kreirajte novi nalog</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>

          <label style={styles.label}>Ime i prezime</label>
          <input
            type="text"
            placeholder="Marko Marković"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />

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

          <label style={styles.label}>Potvrdite lozinku</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />

          <label style={styles.label}>Tip naloga</label>
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="passenger"
                checked={role === 'passenger'}
                onChange={() => setRole('passenger')}
                style={styles.radioInput}
              />
              <span style={role === 'passenger' ? styles.radioTextActive : styles.radioText}>
                Putnik
              </span>
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                value="driver"
                checked={role === 'driver'}
                onChange={() => setRole('driver')}
                style={styles.radioInput}
              />
              <span style={role === 'driver' ? styles.radioTextActive : styles.radioText}>
                Vozač
              </span>
            </label>
          </div>

          <button type="submit" style={styles.btnYellow} disabled={loading}>
            {loading ? 'Registracija...' : 'Registruj se'}
          </button>

        </form>

        <p style={styles.linkText}>
          Već imate nalog?{' '}
          <Link to="/login" style={styles.link}>Prijavite se</Link>
        </p>
        <p style={styles.linkText}>
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
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '8px',
    marginTop: '4px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  radioInput: {
    accentColor: '#eab308',
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  radioText: {
    color: '#9ca3af',
    fontSize: '14px',
  },
  radioTextActive: {
    color: '#e5e7eb',
    fontSize: '14px',
    fontWeight: '600',
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
    marginTop: '8px',
    fontFamily: "'Inter', sans-serif",
  },
  linkText: {
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

export default RegisterPage;