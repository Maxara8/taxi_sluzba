import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { createRide, getMyRides } from '../services/api';

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
  const [rides, setRides] = useState([]);
  const [loadingRides, setLoadingRides] = useState(false);

  // Uzimamo korisnika iz localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // Ucitavamo voznje kada se otvori istorija ili aktivna
  useEffect(() => {
    if (activeTab === 'history' || activeTab === 'active') {
      fetchRides();
    }
  }, [activeTab]);

  const fetchRides = async () => {
    setLoadingRides(true);
    try {
      const { data } = await getMyRides();
      setRides(data);
    } catch (err) {
      console.error('Greška pri učitavanju vožnji:', err);
    } finally {
      setLoadingRides(false);
    }
  };

  const getEstimatedPrice = () => {
    if (!from || !to) return null;
    const vehicle = VEHICLE_OPTIONS.find(v => v.type === vehicleType);
    const distance = Math.floor(Math.random() * 10) + 2;
    const price = vehicle.basePrice + vehicle.perKm * distance;
    return { distance, price };
  };

  const estimated = getEstimatedPrice();

  const activeRide = rides.find(r =>
    ['pending', 'accepted', 'in_progress'].includes(r.status)
  );
  const rideHistory = rides.filter(r =>
    ['completed', 'cancelled'].includes(r.status)
  );

  const handleRequestRide = async (e) => {
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
    try {
      const fromLocation = LOCATIONS.find(l => l.id === from);
      const toLocation = LOCATIONS.find(l => l.id === to);
      const vehicle = VEHICLE_OPTIONS.find(v => v.type === vehicleType);
      const distance = Math.floor(Math.random() * 10) + 2;
      const price = vehicle.basePrice + vehicle.perKm * distance;

      await createRide({
        from: `${fromLocation.name} — ${fromLocation.address}`,
        to: `${toLocation.name} — ${toLocation.address}`,
        vehicleType,
        notes,
        distance,
        price,
      });

      setSuccessMsg('Zahtev za vožnju je uspešno poslat!');
      setFrom('');
      setTo('');
      setNotes('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Greška pri slanju zahteva');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { bg: 'rgba(234,179,8,0.2)', color: '#fde047', label: 'Na čekanju' },
      accepted: { bg: 'rgba(59,130,246,0.2)', color: '#93c5fd', label: 'Prihvaćeno' },
      in_progress: { bg: 'rgba(139,92,246,0.2)', color: '#d8b4fe', label: 'U toku' },
      completed: { bg: 'rgba(34,197,94,0.2)', color: '#86efac', label: 'Završeno' },
      cancelled: { bg: 'rgba(239,68,68,0.2)', color: '#fca5a5', label: 'Otkazano' },
    };
    const s = map[status] || { bg: 'rgba(107,114,128,0.2)', color: '#9ca3af', label: status };
    return (
      <span style={{ backgroundColor: s.bg, color: s.color, padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>
        {s.label}
      </span>
    );
  };

  return (
    <div style={styles.page}>
      <Header role="passenger" />
      <div style={styles.container}>

        {/* Welcome */}
        <div style={styles.welcomeBox}>
          <span style={styles.welcomeIcon}>✨</span>
          <div>
            <h1 style={styles.welcomeTitle}>Dobrodošli, {user?.name}!</h1>
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

              {estimated && (
                <div style={styles.priceBox}>
                  <div>
                    <p style={styles.priceLabel}>Procenjena cena</p>
                    <p style={styles.priceDistance}>Distanca: ~{estimated.distance} km</p>
                  </div>
                  <p style={styles.priceValue}>{estimated.price} RSD</p>
                </div>
              )}

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
            {loadingRides ? (
              <p style={styles.loadingText}>Učitavanje...</p>
            ) : activeRide ? (
              <div>
                <div style={styles.rideHeader}>
                  <h2 style={styles.cardTitle}>🧭 Aktivna vožnja</h2>
                  {getStatusBadge(activeRide.status)}
                </div>
                <div style={styles.routeBox}>
                  <div style={styles.routeRow}>
                    <span>📍</span>
                    <div>
                      <p style={styles.routeLabel}>POLAZIŠTE</p>
                      <p style={styles.routeValue}>{activeRide.from}</p>
                    </div>
                  </div>
                  <div style={styles.divider}></div>
                  <div style={styles.routeRow}>
                    <span>🧭</span>
                    <div>
                      <p style={styles.routeLabel}>ODREDIŠTE</p>
                      <p style={styles.routeValue}>{activeRide.to}</p>
                    </div>
                  </div>
                </div>
                <div style={styles.rideStats}>
                  <div style={styles.rideStatBox}>
                    <p style={styles.rideStatLabel}>DISTANCA</p>
                    <p style={styles.rideStatValue}>📍 {activeRide.distance} km</p>
                  </div>
                  <div style={{ ...styles.rideStatBox, backgroundColor: 'rgba(6,78,59,0.3)' }}>
                    <p style={styles.rideStatLabel}>CENA</p>
                    <p style={{ ...styles.rideStatValue, color: '#34d399' }}>💰 {activeRide.price} RSD</p>
                  </div>
                </div>
                {activeRide.driver && (
                  <div style={styles.driverBox}>
                    <p style={styles.driverLabel}>VOZAČ</p>
                    <p style={styles.driverName}>👤 {activeRide.driver.name}</p>
                  </div>
                )}
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
            {loadingRides ? (
              <p style={styles.loadingText}>Učitavanje...</p>
            ) : rideHistory.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rideHistory.map(ride => (
                  <div key={ride._id} style={styles.historyCard}>
                    <div style={styles.rideHeader}>
                      <div>
                        {getStatusBadge(ride.status)}
                        <p style={styles.rideDate}>
                          {new Date(ride.createdAt).toLocaleDateString('sr-RS')}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: '#fff', fontWeight: '700', margin: 0 }}>{ride.price} RSD</p>
                        <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>{ride.distance} km</p>
                      </div>
                    </div>
                    <div style={styles.routeBox}>
                      <div style={styles.routeRow}>
                        <span>📍</span>
                        <span style={{ color: '#9ca3af', fontSize: '13px' }}>{ride.from}</span>
                      </div>
                      <div style={styles.routeRow}>
                        <span>🧭</span>
                        <span style={{ color: '#9ca3af', fontSize: '13px' }}>{ride.to}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
  },
  container: { maxWidth: '800px', margin: '0 auto', padding: '32px 16px' },
  welcomeBox: {
    background: 'rgba(139, 92, 246, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '16px', padding: '32px',
    display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px',
  },
  welcomeIcon: { fontSize: '40px' },
  welcomeTitle: { color: '#fff', fontSize: '28px', fontWeight: '700', margin: 0 },
  welcomeSubtitle: { color: '#9ca3af', fontSize: '16px', margin: '4px 0 0' },
  tabBar: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', padding: '4px', marginBottom: '24px',
  },
  tab: {
    padding: '10px', backgroundColor: 'transparent', color: '#9ca3af',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
    fontWeight: '500', fontFamily: "'Inter', sans-serif",
  },
  tabActive: {
    padding: '10px', backgroundColor: '#7c3aed', color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
    fontWeight: '600', fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px', padding: '32px',
  },
  cardTitle: { color: '#fff', fontSize: '22px', fontWeight: '700', margin: '0 0 4px' },
  cardSubtitle: { color: '#9ca3af', fontSize: '14px', marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#e5e7eb', fontSize: '14px', fontWeight: '500' },
  select: {
    padding: '12px', borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    color: '#fff', fontSize: '14px', marginBottom: '8px',
    fontFamily: "'Inter', sans-serif", outline: 'none',
  },
  priceBox: {
    background: 'rgba(139, 92, 246, 0.15)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '12px', padding: '16px',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '8px',
  },
  priceLabel: { color: '#d1d5db', fontSize: '14px', margin: 0 },
  priceDistance: { color: '#9ca3af', fontSize: '12px', margin: '2px 0 0' },
  priceValue: { color: '#4ade80', fontSize: '24px', fontWeight: '700', margin: 0 },
  vehicleGrid: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px' },
  vehicleCard: {
    display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
  },
  vehicleCardActive: {
    display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    border: '2px solid #7c3aed',
    borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
  },
  vehicleIcon: { fontSize: '32px' },
  vehicleName: { color: '#fff', fontWeight: '600', margin: 0, fontSize: '15px' },
  vehiclePrice: { color: '#9ca3af', fontSize: '12px', margin: '2px 0 0' },
  checkIcon: { marginLeft: 'auto', fontSize: '20px' },
  textarea: {
    padding: '12px', borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    color: '#fff', fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
    marginBottom: '8px', minHeight: '80px',
    resize: 'vertical', outline: 'none',
  },
  btnYellow: {
    padding: '14px',
    background: 'linear-gradient(to right, #7c3aed, #db2777)',
    color: '#fff', fontWeight: '700', fontSize: '16px',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontFamily: "'Inter', sans-serif", marginTop: '8px',
  },
  error: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171', borderRadius: '8px',
    padding: '10px 12px', fontSize: '13px', marginBottom: '12px',
  },
  success: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    border: '1px solid rgba(34,197,94,0.3)',
    color: '#4ade80', borderRadius: '8px',
    padding: '10px 12px', fontSize: '13px', marginBottom: '12px',
  },
  emptyBox: { padding: '60px 0', textAlign: 'center' },
  emptyIcon: { fontSize: '48px' },
  emptyText: { color: '#9ca3af', fontSize: '16px', marginTop: '16px' },
  loadingText: { color: '#9ca3af', textAlign: 'center', padding: '40px 0' },
  rideHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px',
  },
  routeBox: {
    backgroundColor: 'rgba(15,23,42,0.5)', borderRadius: '12px',
    padding: '16px', marginBottom: '16px',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  routeRow: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  routeLabel: { color: '#9ca3af', fontSize: '11px', margin: 0, fontWeight: '600' },
  routeValue: { color: '#fff', fontSize: '15px', margin: '2px 0 0' },
  divider: { height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' },
  rideStats: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '12px', marginBottom: '16px',
  },
  rideStatBox: {
    backgroundColor: 'rgba(15,23,42,0.5)',
    borderRadius: '10px', padding: '12px',
  },
  rideStatLabel: { color: '#9ca3af', fontSize: '11px', margin: 0, fontWeight: '600' },
  rideStatValue: { color: '#fff', fontSize: '18px', margin: '4px 0 0', fontWeight: '600' },
  driverBox: {
    backgroundColor: 'rgba(139,92,246,0.1)',
    border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: '10px', padding: '12px',
  },
  driverLabel: { color: '#9ca3af', fontSize: '11px', margin: '0 0 4px', fontWeight: '600' },
  driverName: { color: '#fff', fontSize: '16px', margin: 0, fontWeight: '600' },
  historyCard: {
    backgroundColor: 'rgba(15,23,42,0.4)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px', padding: '16px',
  },
  rideDate: { color: '#9ca3af', fontSize: '12px', margin: '6px 0 0' },
};

export default PassengerDashboard;