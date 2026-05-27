import React, { useState } from 'react';
import Header from '../components/Header';

const DEMO_RIDES = [
  { id: '1', passengerName: 'Marko Marković', from: 'Centar, Novi Sad', to: 'FTN, Novi Sad', status: 'completed', price: 270, distance: 3, driverName: 'Jovan Jovanović', requestedAt: new Date() },
  { id: '2', passengerName: 'Ana Anić', from: 'Kej, Novi Sad', to: 'Spens, Novi Sad', status: 'pending', price: 370, distance: 5, driverName: null, requestedAt: new Date() },
  { id: '3', passengerName: 'Petar Petrović', from: 'Stanica, Novi Sad', to: 'Centar, Novi Sad', status: 'in_progress', price: 200, distance: 2, driverName: 'Jovan Jovanović', requestedAt: new Date() },
];

const DEMO_DRIVERS = [
  { id: '1', name: 'Jovan Jovanović', email: 'vozac@test.com', phone: '+381 64 123 4567', isAvailable: true, rating: 4.5, totalRides: 342 },
  { id: '2', name: 'Nikola Nikolić', email: 'nikola@test.com', phone: '+381 63 987 6543', isAvailable: false, rating: 4.8, totalRides: 128 },
];

const DEMO_VEHICLES = [
  { id: '1', brand: 'Škoda', model: 'Octavia', type: 'standard', licensePlate: 'NS 123-AB', year: 2021, isActive: true },
  { id: '2', brand: 'Mercedes', model: 'E-Class', type: 'premium', licensePlate: 'NS 456-CD', year: 2022, isActive: true },
  { id: '3', brand: 'Volkswagen', model: 'Transporter', type: 'kombi', licensePlate: 'NS 789-EF', year: 2020, isActive: false },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('rides');
  const [rides] = useState(DEMO_RIDES);
  const [drivers] = useState(DEMO_DRIVERS);
  const [vehicles, setVehicles] = useState(DEMO_VEHICLES);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ brand: '', model: '', type: 'standard', licensePlate: '', year: 2024 });
  const [errorMsg, setErrorMsg] = useState('');

  const totalRides = rides.length;
  const activeRides = rides.filter(r => ['pending', 'accepted', 'in_progress'].includes(r.status)).length;
  const completedRides = rides.filter(r => r.status === 'completed').length;
  const totalRevenue = rides.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.price, 0);

  const handleAddVehicle = () => {
    if (!newVehicle.brand || !newVehicle.model || !newVehicle.licensePlate) {
      setErrorMsg('Molimo popunite sva polja');
      return;
    }
    setVehicles(prev => [...prev, { ...newVehicle, id: Date.now().toString(), isActive: true }]);
    setNewVehicle({ brand: '', model: '', type: 'standard', licensePlate: '', year: 2024 });
    setShowAddVehicle(false);
    setErrorMsg('');
  };

  const handleDeleteVehicle = (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovo vozilo?')) {
      setVehicles(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleToggleVehicle = (id) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, isActive: !v.isActive } : v));
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
    return <span style={{ backgroundColor: s.bg, color: s.color, padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>{s.label}</span>;
  };

  const statCards = [
    { icon: '🚗', label: 'Ukupno vožnji', value: totalRides, color: '#fff' },
    { icon: '📈', label: 'Aktivne vožnje', value: activeRides, color: '#60a5fa' },
    { icon: '👥', label: 'Vozači', value: `${drivers.length} (${drivers.filter(d => d.isAvailable).length} dostupno)`, color: '#fff' },
    { icon: '💰', label: 'Ukupna zarada', value: `${totalRevenue.toLocaleString()} RSD`, color: '#4ade80' },
  ];

  return (
    <div style={styles.page}>
      <Header role="admin" />
      <div style={styles.container}>

        {/* Naslov */}
        <div style={styles.titleBox}>
          <h1 style={styles.title}>Admin Panel</h1>
          <p style={styles.subtitle}>Upravljajte kompletnim sistemom taksi službe</p>
        </div>

        {/* Stat kartice */}
        <div style={styles.statsGrid}>
          {statCards.map((s, i) => (
            <div key={i} style={styles.statCard}>
              <p style={styles.statLabel}>{s.icon} {s.label}</p>
              <p style={{ ...styles.statValue, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabovi */}
        <div style={styles.tabBar}>
          {['rides', 'drivers', 'vehicles', 'stats'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={activeTab === tab ? styles.tabActive : styles.tab}
            >
              {{ rides: 'Vožnje', drivers: 'Vozači', vehicles: 'Vozila', stats: 'Statistika' }[tab]}
            </button>
          ))}
        </div>

        {/* Voznje */}
        {activeTab === 'rides' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Sve vožnje</h2>
            <p style={styles.cardSubtitle}>Pregled svih vožnji u sistemu</p>
            <div style={styles.tableWrap}>
              {[...rides].reverse().map(ride => (
                <div key={ride.id} style={styles.rideRow}>
                  <div style={styles.rideRowLeft}>
                    <p style={styles.ridePassenger}>{ride.passengerName}</p>
                    <p style={styles.rideDate}>{new Date(ride.requestedAt).toLocaleDateString('sr-RS')}</p>
                    <div style={styles.rideRoute}>
                      <span style={{ color: '#4ade80' }}>📍</span>
                      <span style={styles.routeText}>{ride.from}</span>
                    </div>
                    <div style={styles.rideRoute}>
                      <span style={{ color: '#f87171' }}>🧭</span>
                      <span style={styles.routeText}>{ride.to}</span>
                    </div>
                    {ride.driverName && (
                      <p style={styles.rideDriver}>Vozač: {ride.driverName} • {ride.distance} km</p>
                    )}
                  </div>
                  <div style={styles.rideRowRight}>
                    {getStatusBadge(ride.status)}
                    <p style={styles.ridePrice}>{ride.price} RSD</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vozaci */}
        {activeTab === 'drivers' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Vozači</h2>
            <p style={styles.cardSubtitle}>Upravljanje vozačima</p>
            <div style={styles.tableWrap}>
              <div style={styles.tableHeader}>
                <span style={styles.th}>Ime</span>
                <span style={styles.th}>Email</span>
                <span style={styles.th}>Telefon</span>
                <span style={styles.th}>Status</span>
                <span style={styles.th}>Ocena</span>
                <span style={styles.th}>Vožnje</span>
              </div>
              {drivers.map(driver => (
                <div key={driver.id} style={styles.tableRow}>
                  <span style={styles.td}>{driver.name}</span>
                  <span style={{ ...styles.td, color: '#9ca3af' }}>{driver.email}</span>
                  <span style={{ ...styles.td, color: '#9ca3af' }}>{driver.phone}</span>
                  <span style={styles.td}>
                    <span style={{ backgroundColor: driver.isAvailable ? 'rgba(34,197,94,0.2)' : 'rgba(107,114,128,0.2)', color: driver.isAvailable ? '#4ade80' : '#9ca3af', padding: '3px 10px', borderRadius: '999px', fontSize: '12px' }}>
                      {driver.isAvailable ? 'Dostupan' : 'Nedostupan'}
                    </span>
                  </span>
                  <span style={styles.td}>{driver.rating} ⭐</span>
                  <span style={styles.td}>{driver.totalRides}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vozila */}
        {activeTab === 'vehicles' && (
          <div style={styles.card}>
            <div style={styles.vehicleHeader}>
              <div>
                <h2 style={styles.cardTitle}>Vozila</h2>
                <p style={styles.cardSubtitle}>Upravljanje vozilima u floti</p>
              </div>
              <button style={styles.btnYellow} onClick={() => setShowAddVehicle(!showAddVehicle)}>
                + Dodaj vozilo
              </button>
            </div>

            {/* Forma za dodavanje */}
            {showAddVehicle && (
              <div style={styles.addVehicleForm}>
                <h3 style={styles.formTitle}>Dodaj novo vozilo</h3>
                {errorMsg && <p style={styles.error}>{errorMsg}</p>}
                <div style={styles.formGrid}>
                  <div>
                    <label style={styles.formLabel}>Marka</label>
                    <input style={styles.formInput} placeholder="Škoda" value={newVehicle.brand} onChange={e => setNewVehicle({ ...newVehicle, brand: e.target.value })} />
                  </div>
                  <div>
                    <label style={styles.formLabel}>Model</label>
                    <input style={styles.formInput} placeholder="Octavia" value={newVehicle.model} onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })} />
                  </div>
                  <div>
                    <label style={styles.formLabel}>Registracija</label>
                    <input style={styles.formInput} placeholder="NS 123-AB" value={newVehicle.licensePlate} onChange={e => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })} />
                  </div>
                  <div>
                    <label style={styles.formLabel}>Godina</label>
                    <input style={styles.formInput} type="number" value={newVehicle.year} onChange={e => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })} />
                  </div>
                  <div>
                    <label style={styles.formLabel}>Tip</label>
                    <select style={styles.formInput} value={newVehicle.type} onChange={e => setNewVehicle({ ...newVehicle, type: e.target.value })}>
                      <option value="standard">Standard</option>
                      <option value="kombi">Kombi</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                </div>
                <button style={styles.btnYellow} onClick={handleAddVehicle}>Dodaj vozilo</button>
              </div>
            )}

            <div style={styles.tableWrap}>
              <div style={styles.tableHeader}>
                <span style={styles.th}>Vozilo</span>
                <span style={styles.th}>Tip</span>
                <span style={styles.th}>Registracija</span>
                <span style={styles.th}>Godina</span>
                <span style={styles.th}>Status</span>
                <span style={styles.th}>Akcije</span>
              </div>
              {vehicles.map(v => (
                <div key={v.id} style={styles.tableRow}>
                  <span style={styles.td}>{v.brand} {v.model}</span>
                  <span style={styles.td}>
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#e5e7eb', padding: '3px 10px', borderRadius: '6px', fontSize: '12px' }}>
                      {v.type === 'standard' ? 'Standard' : v.type === 'kombi' ? 'Kombi' : 'Premium'}
                    </span>
                  </span>
                  <span style={styles.td}>{v.licensePlate}</span>
                  <span style={styles.td}>{v.year}</span>
                  <span style={styles.td}>
                    <span style={{ backgroundColor: v.isActive ? 'rgba(34,197,94,0.2)' : 'rgba(107,114,128,0.2)', color: v.isActive ? '#4ade80' : '#9ca3af', padding: '3px 10px', borderRadius: '999px', fontSize: '12px' }}>
                      {v.isActive ? 'Aktivno' : 'Neaktivno'}
                    </span>
                  </span>
                  <span style={{ ...styles.td, display: 'flex', gap: '8px' }}>
                    <button style={styles.btnSmallOutline} onClick={() => handleToggleVehicle(v.id)}>
                      {v.isActive ? 'Deaktiviraj' : 'Aktiviraj'}
                    </button>
                    <button style={styles.btnSmallRed} onClick={() => handleDeleteVehicle(v.id)}>🗑️</button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistika */}
        {activeTab === 'stats' && (
          <div style={styles.statsTabGrid}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Statistika vožnji</h2>
              <div style={styles.statsList}>
                {[
                  { label: 'Ukupno vožnji', value: totalRides, color: '#fff' },
                  { label: 'Završeno', value: completedRides, color: '#4ade80' },
                  { label: 'Aktivno', value: activeRides, color: '#60a5fa' },
                  { label: 'Otkazano', value: rides.filter(r => r.status === 'cancelled').length, color: '#f87171' },
                  { label: 'Prosečna cena', value: `${completedRides > 0 ? Math.round(totalRevenue / completedRides) : 0} RSD`, color: '#fff' },
                ].map((s, i) => (
                  <div key={i} style={styles.statsListRow}>
                    <span style={styles.statsListLabel}>{s.label}</span>
                    <span style={{ ...styles.statsListValue, color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Flota vozila</h2>
              <div style={styles.statsList}>
                {[
                  { label: 'Ukupno vozila', value: vehicles.length, color: '#fff' },
                  { label: 'Standard', value: vehicles.filter(v => v.type === 'standard').length, color: '#fff' },
                  { label: 'Kombi', value: vehicles.filter(v => v.type === 'kombi').length, color: '#fff' },
                  { label: 'Premium', value: vehicles.filter(v => v.type === 'premium').length, color: '#fff' },
                  { label: 'Aktivna vozila', value: vehicles.filter(v => v.isActive).length, color: '#4ade80' },
                ].map((s, i) => (
                  <div key={i} style={styles.statsListRow}>
                    <span style={styles.statsListLabel}>{s.label}</span>
                    <span style={{ ...styles.statsListValue, color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #111827, #1f2937, #111827)',
    fontFamily: "'Inter', sans-serif",
    padding: '32px 16px',
  },
  container: { maxWidth: '1100px', margin: '0 auto' },
  titleBox: { marginBottom: '32px' },
  title: { color: '#fff', fontSize: '28px', fontWeight: '700', margin: 0 },
  subtitle: { color: '#9ca3af', fontSize: '15px', margin: '4px 0 0' },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px', marginBottom: '24px',
  },
  statCard: {
    backgroundColor: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', padding: '20px',
  },
  statLabel: { color: '#9ca3af', fontSize: '13px', margin: '0 0 8px' },
  statValue: { color: '#fff', fontSize: '26px', fontWeight: '700', margin: 0 },
  tabBar: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '4px',
    backgroundColor: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', padding: '4px', marginBottom: '24px',
  },
  tab: {
    padding: '10px', backgroundColor: 'transparent', color: '#9ca3af',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
    fontWeight: '500', fontFamily: "'Inter', sans-serif",
  },
  tabActive: {
    padding: '10px', backgroundColor: '#eab308', color: '#111',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
    fontWeight: '700', fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px', padding: '24px',
  },
  cardTitle: { color: '#fff', fontSize: '20px', fontWeight: '700', margin: '0 0 4px' },
  cardSubtitle: { color: '#9ca3af', fontSize: '13px', margin: '0 0 20px' },
  tableWrap: { display: 'flex', flexDirection: 'column', gap: '12px' },
  tableHeader: {
    display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
    padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  th: { color: '#9ca3af', fontSize: '12px', fontWeight: '600' },
  tableRow: {
    display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
    padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  td: { color: '#e5e7eb', fontSize: '14px' },
  rideRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '16px', backgroundColor: 'rgba(15,23,42,0.4)',
    borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)',
  },
  rideRowLeft: { display: 'flex', flexDirection: 'column', gap: '4px' },
  rideRowRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
  ridePassenger: { color: '#fff', fontWeight: '600', fontSize: '15px', margin: 0 },
  rideDate: { color: '#9ca3af', fontSize: '12px', margin: 0 },
  rideRoute: { display: 'flex', alignItems: 'center', gap: '6px' },
  routeText: { color: '#9ca3af', fontSize: '13px' },
  rideDriver: { color: '#6b7280', fontSize: '12px', margin: 0 },
  ridePrice: { color: '#9ca3af', fontSize: '13px', margin: 0 },
  vehicleHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  addVehicleForm: {
    backgroundColor: 'rgba(15,23,42,0.5)', borderRadius: '12px',
    padding: '20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.1)',
  },
  formTitle: { color: '#fff', fontSize: '16px', fontWeight: '600', margin: '0 0 16px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px' },
  formLabel: { color: '#e5e7eb', fontSize: '13px', display: 'block', marginBottom: '4px' },
  formInput: {
    width: '100%', padding: '8px 10px', borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(51,65,85,0.5)',
    color: '#fff', fontSize: '14px', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box',
  },
  btnYellow: {
    padding: '10px 20px', backgroundColor: '#eab308', color: '#111',
    fontWeight: '700', fontSize: '14px', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
  },
  btnSmallOutline: {
    padding: '5px 10px', backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)', color: '#e5e7eb',
    borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: "'Inter', sans-serif",
  },
  btnSmallRed: {
    padding: '5px 10px', backgroundColor: 'rgba(239,68,68,0.2)',
    border: '1px solid rgba(239,68,68,0.3)', color: '#f87171',
    borderRadius: '6px', cursor: 'pointer', fontSize: '12px',
  },
  error: {
    backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', marginBottom: '12px',
  },
  statsTabGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' },
  statsList: { display: 'flex', flexDirection: 'column', gap: '0' },
  statsListRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  statsListLabel: { color: '#9ca3af', fontSize: '14px' },
  statsListValue: { color: '#fff', fontSize: '16px', fontWeight: '600' },
};

export default AdminDashboard;