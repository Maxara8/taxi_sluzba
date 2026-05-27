import React, { useState } from 'react';
import Header from '../components/Header';
<Header role="passenger" />

const LOCATIONS = [
  { id: 'centar', name: 'Centar', address: 'Trg slobode, Novi Sad' },
  { id: 'stanica', name: 'Železnička stanica', address: 'Bulevar Jaše Tomića, Novi Sad' },
  { id: 'aerodrom', name: 'Aerodrom', address: 'Aerodrom Nikola Tesla, Beograd' },
  { id: 'keja', name: 'Kej', address: 'Dunavska obala, Novi Sad' },
  { id: 'ftn', name: 'FTN', address: 'Trg Dositeja Obradovića, Novi Sad' },
  { id: 'spens', name: 'Spens', address: 'Sutjeska 2, Novi Sad' },
];

const VEHICLE_OPTIONS = [
  { type: 'standard', name: 'Standard', price: 'Početna: 120 RSD + 50 RSD/km', icon: '🚗', basePrice: 120, perKm: 50 },
  { type: 'kombi', name: 'Kombi', price: 'Početna: 150 RSD + 60 RSD/km', icon: '🚐', basePrice: 150, perKm: 60 },
  { type: 'premium', name: 'Premium', price: 'Početna: 200 RSD + 80 RSD/km', icon: '✨', basePrice: 200, perKm: 80 },
];

function PassengerDashboard() {
  const [activeTab, setActiveTab] = useState('new-ride');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [vehicleType, setVehicleType] = useState('standard');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Simulacija aktivne voznje i istorije
  const activeRide = null;
  const rideHistory = [];

  const getEstimatedPrice = () => {
    if (!from || !to) return null;
    const vehicle = VEHICLE_OPTIONS.find(v => v.type === vehicleType);
    const distance = Math.floor(Math.random() * 10) + 2; // simulacija distance
    const price = vehicle.basePrice + vehicle.perKm * distance;
    return { distance, price };
  };

  const estimated = getEstimatedPrice();

  const handleRequestRide = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!from || !to) {
      setErrorMsg('Molimo izaberite polazište i odredište');
      return;
    }
    if (from === to) {
      setErrorMsg('Polazište i odredište ne mogu biti isti');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setSuccessMsg('Zahtev za vožnju je uspešno poslat!');
      setFrom('');
      setTo('');
      setNotes('');
      setLoading(false);
    }, 1000);
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { bg: '#854d0e', color: '#fde047', label: 'Na čekanju' },
      accepted: { bg: '#1e3a5f', color: '#93c5fd', label: 'Prihvaćeno' },
      in_progress: { bg: '#3b0764', color: '#d8b4fe', label: 'U toku' },
      completed: { bg: '#14532d', color: '#86efac', label: 'Završeno' },
      cancelled: { bg: '#7f1d1d', color: '#fca5a5', label: 'Otkazano' },
    };
    const s = map[status] || { bg: '#374151', color: '#9ca3af', label: status };
    return (
      <span style={{ backgroundColor: s.bg, color: s.color, padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>
        {s.label}
      </span>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Welcome Header */}
        <div style={styles.welcomeBox}>
          <span style={styles.welcomeIcon}>✨</span>
          <div>
            <h1 style={styles.welcomeTitle}>Dobrodošli, Putniče!</h1>
            <p style={styles.welcomeSubtitle}>Naručite vožnju ili pratite svoje aktivnosti</p>
          </div>
        </div>

        {/* Tabovi */}
        <div style={styles.tabBar}>
          {[
            { key: 'new-ride', label: '⚡ Nova vožnja' },
            { key: 'active', label: '🧭 Aktivna' },
            { key: 'history', label: '🕐 Istorija' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={activeTab === tab.key ? styles.tabActive : styles.tab}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Nova voznja */}
        {activeTab === 'new-ride' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>⚡ Naručite vožnju</h2>
            <p style={styles.cardSubtitle}>Unesite detalje vaše vožnje</p>

            {errorMsg && <p style={styles.error}>{errorMsg}</p>}
            {successMsg && <p style={styles.success}>{successMsg}</p>}

            <form onSubmit={handleRequestRide} style={styles.form}>

              <label style={styles.label}>📍 Polazište</label>
              <select value={from} onChange={e => setFrom(e.target.value)} style={styles.select}>
                <option value="">Izaberite polazište</option>
                {LOCATIONS.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name} — {loc.address}</option>
                ))}
              </select>

              <label style={styles.label}>🧭 Odredište</label>
              <select value={to} onChange={e => setTo(e.target.value)} style={styles.select}>
                <option value="">Izaberite odredište</option>
                {LOCATIONS.filter(loc => loc.id !== from).map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name} — {loc.address}</option>
                ))}
              </select>

              {/* Procenjena cena */}
              {estimated && (
                <div style={styles.priceBox}>
                  <div>
                    <p style={styles.priceLabel}>Procenjena cena</p>
                    <p style={styles.priceDistance}>Distanca: ~{estimated.distance} km</p>
                  </div>
                  <p style={styles.priceValue}>{estimated.price} RSD</p>
                </div>
              )}

              {/* Tip vozila */}
              <label style={styles.label}>Tip vozila</label>
              <div style={styles.vehicleGrid}>
                {VEHICLE_OPTIONS.map(opt => (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setVehicleType(opt.type)}
                    style={vehicleType === opt.type ? styles.vehicleCardActive : styles.vehicleCard}
                  >
                    <span style={styles.vehicleIcon}>{opt.icon}</span>
                    <div>
                      <p style={styles.vehicleName}>{opt.name}</p>
                      <p style={styles.vehiclePrice}>{opt.price}</p>
                    </div>
                    {vehicleType === opt.type && <span style={styles.checkIcon}>✅</span>}
                  </button>
                ))}
              </div>

              <label style={styles.label}>Napomena (opcionalno)</label>
              <textarea
                placeholder="Dodatne informacije za vozača"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={styles.textarea}
              />

              <button type="submit" style={styles.btnYellow} disabled={loading}>
                {loading ? 'Slanje zahteva...' : '🚀 Naruči vožnju'}
              </button>

            </form>
          </div>
        )}

        {/* Aktivna voznja */}
        {activeTab === 'active' && (
          <div style={styles.card}>
            {activeRide ? (
              <div>
                <h2 style={styles.cardTitle}>🧭 Aktivna vožnja</h2>
              </div>
            ) : (
              <div style={styles.emptyBox}>
                <span style={styles.emptyIcon}>🧭</span>
                <p style={styles.emptyText}>Nemate aktivnih vožnji</p>
              </div>
            )}
          </div>
        )}

        {/* Istorija */}
        {activeTab === 'history' && (
          <div style={styles.card}>
            {rideHistory.length > 0 ? (
              rideHistory.map(ride => (
                <div key={ride.id} style={styles.historyItem}>
                  <p>{ride.from} → {ride.to}</p>
                  {getStatusBadge(ride.status)}
                </div>
              ))
            ) : (
              <div style={styles.emptyBox}>
                <span style={styles.emptyIcon}>🕐</span>
                <p style={styles.emptyText}>Nemate istoriju vožnji</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a, #1e1b4b, #0f172a)',
    fontFamily: "'Inter', sans-serif",
    padding: '32px 16px',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  welcomeBox: {
    background: 'rgba(139, 92, 246, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '16px',
    padding: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
  },
  welcomeIcon: { fontSize: '40px' },
  welcomeTitle: { color: '#fff', fontSize: '28px', fontWeight: '700', margin: 0 },
  welcomeSubtitle: { color: '#9ca3af', fontSize: '16px', margin: '4px 0 0' },
  tabBar: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '4px',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '4px',
    marginBottom: '24px',
  },
  tab: {
    padding: '10px',
    backgroundColor: 'transparent',
    color: '#9ca3af',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: "'Inter', sans-serif",
  },
  tabActive: {
    padding: '10px',
    backgroundColor: '#7c3aed',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '32px',
  },
  cardTitle: { color: '#fff', fontSize: '22px', fontWeight: '700', margin: '0 0 4px' },
  cardSubtitle: { color: '#9ca3af', fontSize: '14px', marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#e5e7eb', fontSize: '14px', fontWeight: '500' },
  select: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    color: '#fff',
    fontSize: '14px',
    marginBottom: '8px',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
  },
  priceBox: {
    background: 'rgba(139, 92, 246, 0.15)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  priceLabel: { color: '#d1d5db', fontSize: '14px', margin: 0 },
  priceDistance: { color: '#9ca3af', fontSize: '12px', margin: '2px 0 0' },
  priceValue: { color: '#4ade80', fontSize: '24px', fontWeight: '700', margin: 0 },
  vehicleGrid: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px' },
  vehicleCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  vehicleCardActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    border: '2px solid #7c3aed',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  vehicleIcon: { fontSize: '32px' },
  vehicleName: { color: '#fff', fontWeight: '600', margin: 0, fontSize: '15px' },
  vehiclePrice: { color: '#9ca3af', fontSize: '12px', margin: '2px 0 0' },
  checkIcon: { marginLeft: 'auto', fontSize: '20px' },
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    color: '#fff',
    fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
    marginBottom: '8px',
    minHeight: '80px',
    resize: 'vertical',
    outline: 'none',
  },
  btnYellow: {
    padding: '14px',
    background: 'linear-gradient(to right, #7c3aed, #db2777)',
    color: '#fff',
    fontWeight: '700',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    marginTop: '8px',
  },
  error: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '13px',
    marginBottom: '12px',
  },
  success: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    border: '1px solid rgba(34,197,94,0.3)',
    color: '#4ade80',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '13px',
    marginBottom: '12px',
  },
  emptyBox: {
    padding: '60px 0',
    textAlign: 'center',
  },
  emptyIcon: { fontSize: '48px' },
  emptyText: { color: '#9ca3af', fontSize: '16px', marginTop: '16px' },
  historyItem: {
    padding: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
  },
};

export default PassengerDashboard;