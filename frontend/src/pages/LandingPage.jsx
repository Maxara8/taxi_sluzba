import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={styles.page}>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logoRow}>
            <span style={styles.logoEmoji}>🚖</span>
            <span style={styles.logoText}>TaxiServis</span>
          </div>
          <nav style={styles.nav}>
            <Link to="/login" style={styles.navLinkGhost}>Prijava</Link>
            <Link to="/register" style={styles.navLinkYellow}>Registracija</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Brza i Pouzdana Taksi Usluga</h1>
        <p style={styles.heroSubtitle}>
          Naručite vožnju u samo nekoliko klikova. Dostupni smo 24/7 sa profesionalnim vozačima i modernim vozilima.
        </p>
        <div style={styles.heroButtons}>
          <Link to="/register" style={styles.btnYellow}>Počni Sada</Link>
          <Link to="/login" style={styles.btnOutline}>Prijavi Se</Link>
        </div>
      </section>

      {/* Zašto mi */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Zašto Odabrati Nas?</h2>
        <div style={styles.grid4}>
          {[
            { icon: '⏱️', title: 'Brza Usluga', desc: 'Prosečno vreme dolaska vozila je manje od 5 minuta u centru grada.' },
            { icon: '🛡️', title: 'Sigurnost', desc: 'Svi vozači su provereni i licencirani. Pratite vožnju u realnom vremenu.' },
            { icon: '⭐', title: 'Kvalitet', desc: 'Moderna i čista vozila. Prosečna ocena naših vozača je 4.8/5.' },
            { icon: '📍', title: 'Dostupnost', desc: 'Pokrivamo ceo grad i okolinu. Dostupni 24 sata dnevno, 7 dana u nedelji.' },
          ].map((item) => (
            <div key={item.title} style={styles.card}>
              <span style={styles.cardIcon}>{item.icon}</span>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tipovi vozila */}
      <section style={styles.sectionDark}>
        <h2 style={styles.sectionTitle}>Tipovi Vozila</h2>
        <div style={styles.grid3}>
          {[
            {
              title: 'Standard',
              price: 'Od 120 RSD + 50 RSD/km',
              items: ['Komfortna sedišta za 4 putnika', 'Klimatizacija', 'Prostor za prtljag', 'Idealno za gradske vožnje'],
            },
            {
              title: 'Kombi',
              price: 'Od 150 RSD + 60 RSD/km',
              items: ['Kapacitet do 8 putnika', 'Ekstra prostor za prtljag', 'Klimatizacija', 'Idealno za grupe'],
            },
            {
              title: 'Premium',
              price: 'Od 200 RSD + 80 RSD/km',
              items: ['Luksuzna vozila (Mercedes, BMW)', 'Kožna sedišta', 'Wi-Fi i osveženje', 'VIP tretman'],
            },
          ].map((v) => (
            <div key={v.title} style={styles.card}>
              <h3 style={styles.cardTitle}>{v.title}</h3>
              <p style={styles.cardPrice}>{v.price}</p>
              <ul style={styles.list}>
                {v.items.map((item) => (
                  <li key={item} style={styles.listItem}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2 style={styles.sectionTitle}>Spremni za Vožnju?</h2>
        <p style={styles.heroSubtitle}>Registrujte se besplatno i uživajte u kvalitetnoj taksi usluzi</p>
        <Link to="/register" style={styles.btnYellow}>Registruj Se Besplatno</Link>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerLogoRow}>
          <span>🚖</span>
          <span style={styles.footerLogoText}>TaxiServis</span>
        </div>
        <p style={styles.footerText}>Profesionalna taksi usluga za ceo grad</p>
        <p style={styles.footerText}>📞 +381 11 123 4567</p>
      </footer>

    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #111827, #1f2937, #111827)',
    fontFamily: "'Inter', sans-serif",
    color: '#fff',
  },
  // Header
  header: {
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    padding: '16px 0',
  },
  headerInner: {
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
  logoEmoji: {
    fontSize: '32px',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
  },
  nav: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  navLinkGhost: {
    color: '#d1d5db',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
  },
  navLinkYellow: {
    color: '#111',
    backgroundColor: '#eab308',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
  },
  // Hero
  hero: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '80px 24px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '700',
    marginBottom: '24px',
    lineHeight: '1.2',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: '#d1d5db',
    marginBottom: '32px',
    maxWidth: '600px',
    margin: '0 auto 32px',
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
  },
  btnYellow: {
    backgroundColor: '#eab308',
    color: '#111',
    padding: '12px 28px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '15px',
  },
  btnOutline: {
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    padding: '12px 28px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '15px',
  },
  // Sekcije
  section: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '80px 24px',
  },
  sectionDark: {
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    padding: '80px 24px',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '48px',
    color: '#fff',
  },
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '24px',
  },
  cardIcon: {
    fontSize: '40px',
    display: 'block',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '8px',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#d1d5db',
    lineHeight: '1.6',
  },
  cardPrice: {
    fontSize: '14px',
    color: '#9ca3af',
    marginBottom: '16px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    fontSize: '14px',
    color: '#d1d5db',
    padding: '4px 0',
  },
  // CTA
  cta: {
    padding: '80px 24px',
    textAlign: 'center',
  },
  // Footer
  footer: {
    backgroundColor: '#030712',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '40px 24px',
    textAlign: 'center',
  },
  footerLogoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '12px',
    fontSize: '24px',
  },
  footerLogoText: {
    fontSize: '20px',
    fontWeight: '600',
  },
  footerText: {
    color: '#9ca3af',
    fontSize: '14px',
    margin: '4px 0',
  },
};

export default LandingPage;