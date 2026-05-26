import React, { useState } from 'react';

const DEMO_RIDES = [
  { id: '1', passengerName: 'Marko Marković', from: 'Centar — Trg slobode, Novi Sad', to: 'FTN — Trg Dositeja Obradovića, Novi Sad', distance: 3, price: 270, status: 'pending', vehicleType: 'standard', notes: '' },
  { id: '2', passengerName: 'Ana Anić', from: 'Kej — Dunavska obala', to: 'Spens — Sutjeska 2', distance: 5, price: 370, status: 'pending', vehicleType: 'kombi', notes: 'Imam prtljag' },
];

function DriverDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [isAvailable, setIsAvailable] = useState(true);
  const [rides, setRides] = useState(DEMO_RIDES);
  const [activeRide, setActiveRide] = useState(null);
  const [completedRides, setCompletedRides] = useState([]);

  const pendingRides = rides.filter(r => r.status === 'pending');
  const totalEarnings = completedRides.reduce((sum, r) => sum + r.price, 0);

  const handleAcceptRide = (ride) => {
    setActiveRide({ ...ride, status: 'accepted' });
    setRides(prev => prev.filter(r => r.id !== ride.id));
    setActiveTab('active');
  };

  const handleStartRide = () => {
    setActiveRide(prev => ({ ...prev, status: 'in_progress' }));
  };

  const handleCompleteRide = () => {
    setCompletedRides(prev => [...prev, { ...activeRide, status: 'completed' }]);
    setActiveRide(null);
    setActiveTab('history');
  };

  const statCards = [
    { icon: '📊', value: completedRides.length, label: 'Ukupno vožnji', bg: 'rgba(30,58,138,0.4)', border: 'rgba(59,130,246,0.3)', color: '#60a5fa' },
    { icon: '⭐', value: '5.0 ⭐', label: 'Prosečna ocena', bg: 'rgba(78,63,0,0.4)', border: 'rgba(234,179,8,0.3)', color: '#fbbf24' },
    { icon: '💵', value: '0', label: 'Danas (RSD)', bg: 'rgba(6,78,59,0.4)', border: 'rgba(16,185,129,0.3)', color: '#34d399' },
    { icon: '💰', value: totalEarnings, label: 'Ukupno (RSD)', bg: 'rgba(59,7,100,0.4)', border: 'rgba(139,92,246,0.3)', color: '#a78bfa' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.pageTitle}>Vozač Panel</h1>
            <p style={styles.pageSubtitle}>Jovan Jovanović</p>
          </div>
          <div style={isAvailable ? styles.statusOnline : styles.statusOffline}>
            <span style={isAvailable ? styles.dotOnline : styles.dotOffline}></span>
            {isAvailable ? 'ONLINE' : 'OFFLINE'}
          </div>
        </div>

        {/* Stat kartice */}
        <div style={styles.statsGrid}>
          {statCards.map((s, i) => (
            <div key={i} style={{ ...styles.statCard, backgroundColor: s.bg, border: `1px solid ${s.border}` }}>
              <div style={styles.statTop}>
                <span style={{ ...styles.statIcon, color: s.color }}>{s.icon}</span>
                <span style={styles.statValue}>{s.value}</span>
              </div>
              <p style={styles.statLabel}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toggle dostupnost */}
        <div style={styles.toggleCard}>
          <div style={styles.toggleLeft}>
            <div style={{ ...styles.toggleIconBox, backgroundColor: isAvailable ? 'rgba(16,185,129,0.2)' : 'rgba(107,114,128,0.2)' }}>
              <span style={{ fontSize: '20px' }}>📡</span>
            </div>
            <div>
              <p style={styles.toggleTitle}>Status Dostupnosti</p>
              <p style={styles.toggleSubtitle}>
                {isAvailable ? '✓ Primanje novih zahteva omogućeno' : '✕ Primanje novih zahteva onemogućeno'}
              </p>
            </div>
          </div>
          {/* Toggle switch */}
          <div
            onClick={() => setIsAvailable(!isAvailable)}
            style={isAvailable ? styles.switchOn : styles.switchOff}
          >
            <div style={isAvailable ? styles.switchThumbOn : styles.switchThumbOff}></div>
          </div>
        </div>

        {/* Tabovi */}
        <div style={styles.tabBar}>
          {[
            { key: 'pending', label: `🔔 Novi zahtevi ${pendingRides.length > 0 ? `(${pendingRides.length})` : ''}` },
            { key: 'active', label: '🧭 Aktivna vožnja' },
            { key: 'history', label: '✅ Istorija' },
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

        {/* Novi zahtevi */}
        {activeTab === 'pending' && (
          <div style={styles.tabContent}>
            {pendingRides.length > 0 ? pendingRides.map(ride => (
              <div key={ride.id} style={styles.rideCard}>
                <div style={styles.rideHeader}>
                  <div>
                    <p style={styles.rideName}>👤 {ride.passengerName}</p>
                    <p style={styles.rideTime}>🕐 Upravo naručeno</p>
                  </div>
                  <span style={styles.vehicleBadge}>
                    {ride.vehicleType === 'standard' ? 'Standard' : ride.vehicleType === 'kombi' ? 'Kombi' : 'Premium'}
                  </span>
                </div>

                <div style={styles.routeBox}>
                  <div style={styles.routeRow}>
                    <span style={styles.dotGreen}>📍</span>
                    <div>
                      <p style={styles.routeLabel}>POLAZIŠTE</p>
                      <p style={styles.routeValue}>{ride.from}</p>
                    </div>
                  </div>
                  <div style={styles.divider}></div>
                  <div style={styles.routeRow}>
                    <span>🧭</span>
                    <div>
                      <p style={styles.routeLabel}>ODREDIŠTE</p>
                      <p style={styles.routeValue}>{ride.to}</p>
                    </div>
                  </div>
                </div>

                <div style={styles.rideStats}>
                  <div style={styles.rideStatBox}>
                    <p style={styles.rideStatLabel}>DISTANCA</p>
                    <p style={styles.rideStatValue}>📍 {ride.distance} km</p>
                  </div>
                  <div style={{ ...styles.rideStatBox, backgroundColor: 'rgba(6,78,59,0.3)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <p style={styles.rideStatLabel}>ZARADA</p>
                    <p style={{ ...styles.rideStatValue, color: '#34d399' }}>💰 {ride.price} RSD</p>
                  </div>
                </div>

                {ride.notes ? (
                  <div style={styles.notesBox}>
                    <p style={styles.notesLabel}>ℹ️ NAPOMENA</p>
                    <p style={styles.notesText}>{ride.notes}</p>
                  </div>
                ) : null}

                <button
                  style={isAvailable && !activeRide ? styles.btnGreen : styles.btnDisabled}
                  onClick={() => handleAcceptRide(ride)}
                  disabled={!isAvailable || !!activeRide}
                >
                  ✓ Prihvati vožnju
                </button>
              </div>
            )) : (
              <div style={styles.emptyBox}>
                <span style={styles.emptyIcon}>🔔</span>
                <p style={styles.emptyText}>Trenutno nema novih zahteva</p>
                <p style={styles.emptySubText}>Zahtevi će se pojaviti ovde kada ih putnici pošalju</p>
              </div>
            )}
          </div>
        )}

        {/* Aktivna voznja */}
        {activeTab === 'active' && (
          <div style={styles.tabContent}>
            {activeRide ? (
              <div style={styles.activeRideCard}>
                <div style={styles.rideHeader}>
                  <div>
                    <p style={styles.rideName}>🧭 {activeRide.passengerName}</p>
                    <p style={styles.rideTime}>
                      {activeRide.status === 'accepted' ? '⏱ Priprema za polazak' : '🚗 Vožnja u toku'}
                    </p>
                  </div>
                  <span style={activeRide.status === 'in_progress' ? styles.badgeBlue : styles.badgeYellow}>
                    {activeRide.status === 'accepted' ? 'Prihvaćeno' : 'U toku'}
                  </span>
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
                  <div style={{ ...styles.rideStatBox, backgroundColor: 'rgba(6,78,59,0.3)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <p style={styles.rideStatLabel}>ZARADA</p>
                    <p style={{ ...styles.rideStatValue, color: '#34d399' }}>💰 {activeRide.price} RSD</p>
                  </div>
                </div>

                {activeRide.status === 'accepted' ? (
                  <button style={styles.btnBlue} onClick={handleStartRide}>▶ Započni vožnju</button>
                ) : (
                  <button style={styles.btnGreen} onClick={handleCompleteRide}>✓ Završi vožnju</button>
                )}
              </div>
            ) : (
              <div style={styles.emptyBox}>
                <span style={styles.emptyIcon}>🧭</span>
                <p style={styles.emptyText}>Nemate aktivnih vožnji</p>
                <p style={styles.emptySubText}>{isAvailable ? 'Prihvatite zahtev iz Novi zahtevi taba' : 'Postavite status na Online'}</p>
              </div>
            )}
          </div>
        )}

        {/* Istorija */}
        {activeTab === 'history' && (
          <div style={styles.tabContent}>
            {completedRides.length > 0 ? [...completedRides].reverse().map((ride, i) => (
              <div key={i} style={styles.historyCard}>
                <div style={styles.rideHeader}>
                  <div>
                    <p style={styles.rideName}>✅ {ride.passengerName}</p>
                    <p style={styles.rideTime}>Upravo završeno</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#34d399', fontWeight: '700', fontSize: '18px', margin: 0 }}>+{ride.price} RSD</p>
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
            )) : (
              <div style={styles.emptyBox}>
                <span style={styles.emptyIcon}>📈</span>
                <p style={styles.emptyText}>Još nemate završenih vožnji</p>
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
    background: 'linear-gradient(135deg, #022c22, #042f2e, #0c1a3a)',
    fontFamily: "'Inter', sans-serif",
    padding: '32px 16px',
  },
  container: { maxWidth: '900px', margin: '0 auto' },
  headerRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px',
  },
  pageTitle: { color: '#fff', fontSize: '28px', fontWeight: '700', margin: 0 },
  pageSubtitle: { color: '#9ca3af', fontSize: '15px', margin: '4px 0 0' },
  statusOnline: {
    display: 'flex', alignItems: 'center', gap: '8px',
    backgroundColor: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)',
    borderRadius: '999px', padding: '8px 20px', color: '#fff', fontWeight: '600',
  },
  statusOffline: {
    display: 'flex', alignItems: 'center', gap: '8px',
    backgroundColor: 'rgba(107,114,128,0.2)', border: '1px solid rgba(107,114,128,0.3)',
    borderRadius: '999px', padding: '8px 20px', color: '#fff', fontWeight: '600',
  },
  dotOnline: {
    width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#34d399', display: 'block',
  },
  dotOffline: {
    width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#9ca3af', display: 'block',
  },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px',
  },
  statCard: {
    borderRadius: '12px', padding: '20px',
  },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  statIcon: { fontSize: '28px' },
  statValue: { color: '#fff', fontSize: '28px', fontWeight: '700' },
  statLabel: { color: '#9ca3af', fontSize: '13px', margin: 0 },
  toggleCard: {
    backgroundColor: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '24px',
  },
  toggleLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  toggleIconBox: { borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  toggleTitle: { color: '#fff', fontSize: '16px', fontWeight: '600', margin: 0 },
  toggleSubtitle: { color: '#9ca3af', fontSize: '13px', margin: '4px 0 0' },
  switchOn: {
    width: '52px', height: '28px', backgroundColor: '#10b981', borderRadius: '999px',
    cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
  },
  switchOff: {
    width: '52px', height: '28px', backgroundColor: '#4b5563', borderRadius: '999px',
    cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
  },
  switchThumbOn: {
    position: 'absolute', right: '4px', top: '4px',
    width: '20px', height: '20px', backgroundColor: '#fff', borderRadius: '50%', transition: 'all 0.2s',
  },
  switchThumbOff: {
    position: 'absolute', left: '4px', top: '4px',
    width: '20px', height: '20px', backgroundColor: '#fff', borderRadius: '50%', transition: 'all 0.2s',
  },
  tabBar: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px',
    backgroundColor: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', padding: '4px', marginBottom: '24px',
  },
  tab: {
    padding: '10px', backgroundColor: 'transparent', color: '#9ca3af',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
    fontWeight: '500', fontFamily: "'Inter', sans-serif",
  },
  tabActive: {
    padding: '10px', backgroundColor: '#059669', color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
    fontWeight: '600', fontFamily: "'Inter', sans-serif",
  },
  tabContent: { display: 'flex', flexDirection: 'column', gap: '16px' },
  rideCard: {
    backgroundColor: 'rgba(30,41,59,0.6)', border: '1px solid rgba(16,185,129,0.2)',
    borderRadius: '16px', padding: '24px',
  },
  activeRideCard: {
    background: 'linear-gradient(135deg, rgba(30,58,138,0.4), rgba(6,78,59,0.4))',
    border: '1px solid rgba(59,130,246,0.3)', borderRadius: '16px', padding: '24px',
  },
  historyCard: {
    backgroundColor: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', padding: '20px',
  },
  rideHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  rideName: { color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 },
  rideTime: { color: '#9ca3af', fontSize: '13px', margin: '4px 0 0' },
  vehicleBadge: {
    backgroundColor: 'rgba(16,185,129,0.2)', color: '#6ee7b7',
    border: '1px solid rgba(16,185,129,0.3)', borderRadius: '999px',
    padding: '4px 12px', fontSize: '12px', fontWeight: '600',
  },
  badgeBlue: {
    backgroundColor: 'rgba(59,130,246,0.2)', color: '#93c5fd',
    border: '1px solid rgba(59,130,246,0.3)', borderRadius: '999px',
    padding: '4px 12px', fontSize: '12px', fontWeight: '600',
  },
  badgeYellow: {
    backgroundColor: 'rgba(234,179,8,0.2)', color: '#fde047',
    border: '1px solid rgba(234,179,8,0.3)', borderRadius: '999px',
    padding: '4px 12px', fontSize: '12px', fontWeight: '600',
  },
  routeBox: {
    backgroundColor: 'rgba(15,23,42,0.5)', borderRadius: '12px', padding: '16px',
    marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px',
  },
  routeRow: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  routeLabel: { color: '#9ca3af', fontSize: '11px', margin: 0, fontWeight: '600' },
  routeValue: { color: '#fff', fontSize: '15px', margin: '2px 0 0' },
  dotGreen: { color: '#34d399' },
  divider: { height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' },
  rideStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' },
  rideStatBox: {
    backgroundColor: 'rgba(15,23,42,0.5)', borderRadius: '10px', padding: '12px',
  },
  rideStatLabel: { color: '#9ca3af', fontSize: '11px', margin: 0, fontWeight: '600' },
  rideStatValue: { color: '#fff', fontSize: '18px', margin: '4px 0 0', fontWeight: '600' },
  notesBox: {
    backgroundColor: 'rgba(30,58,138,0.2)', border: '1px solid rgba(59,130,246,0.2)',
    borderRadius: '10px', padding: '12px', marginBottom: '16px',
  },
  notesLabel: { color: '#93c5fd', fontSize: '11px', margin: '0 0 4px', fontWeight: '600' },
  notesText: { color: '#d1d5db', fontSize: '14px', margin: 0 },
  btnGreen: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(to right, #059669, #0d9488)',
    color: '#fff', fontWeight: '700', fontSize: '15px',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  btnBlue: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(to right, #2563eb, #0891b2)',
    color: '#fff', fontWeight: '700', fontSize: '15px',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  btnDisabled: {
    width: '100%', padding: '14px',
    backgroundColor: '#374151', color: '#6b7280', fontWeight: '700', fontSize: '15px',
    border: 'none', borderRadius: '8px', cursor: 'not-allowed',
    fontFamily: "'Inter', sans-serif",
  },
  emptyBox: { padding: '60px 0', textAlign: 'center' },
  emptyIcon: { fontSize: '48px' },
  emptyText: { color: '#9ca3af', fontSize: '16px', margin: '16px 0 4px' },
  emptySubText: { color: '#6b7280', fontSize: '13px', margin: 0 },
};

export default DriverDashboard;