import { Link } from 'react-router-dom';
import { AnimatedCounter } from '../components/StatCard';

/* ── Impact Stats ── */
const STATS = [
  { icon: '🍱', value: 12840,  suffix: '+', label: 'Meals Saved'       },
  { icon: '♻️', value: 3200,   suffix: 'kg', label: 'Waste Composted'  },
  { icon: '🤝', value: 284,    suffix: '+', label: 'NGO Partners'       },
  { icon: '🌍', value: 9640,   suffix: 'kg', label: 'CO₂ Reduced'      },
];

/* ── Features ── */
const FEATURES = [
  {
    icon: '🍽️', title: 'Smart Food Matching',
    desc: 'AI-powered algorithm instantly connects surplus food donors with the nearest NGOs within a 20 km radius.',
    color: '#4ade80',
  },
  {
    icon: '🗺️', title: 'Live Map Tracking',
    desc: 'Real-time interactive map showing active donations, pickup routes, and NGO locations across the city.',
    color: '#60a5fa',
  },
  {
    icon: '♻️', title: 'Organic Waste → Compost',
    desc: 'Kitchen waste is routed to agricultural trusts to generate organic compost, closing the food loop.',
    color: '#f59e0b',
  },
  {
    icon: '📊', title: 'Impact Analytics',
    desc: 'Live dashboards tracking meals saved, CO₂ reduced, and waste composted — aligned with UN SDG Goals.',
    color: '#a78bfa',
  },
  {
    icon: '🔔', title: 'Real-time Notifications',
    desc: 'NGOs get instant alerts for nearby food availability — zero delay, maximum efficiency.',
    color: '#f472b6',
  },
  {
    icon: '🏆', title: 'Donor Leaderboard',
    desc: 'Gamified contribution rankings to incentivize restaurants, households and caterers to donate more.',
    color: '#34d399',
  },
];

/* ── How It Works ── */
const STEPS = [
  { n: 1, icon: '📸', title: 'Donor Lists Food',      desc: 'Restaurants or households post surplus food details — type, quantity, location, expiry.' },
  { n: 2, icon: '🤖', title: 'AI Matches NGO',        desc: 'Our matching engine identifies the nearest verified NGO and sends real-time notification.' },
  { n: 3, icon: '🚗', title: 'NGO Picks Up',          desc: 'NGO accepts, gets route-optimized directions, and collects the food.' },
  { n: 4, icon: '🍱', title: 'Food Reaches People',   desc: 'Meals are distributed to underserved communities. Impact recorded on dashboards.' },
];

export default function LandingPage() {
  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ══ HERO ══ */}
      <section style={{
        minHeight: '92vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        padding: '60px 24px 80px'
      }}>
        {/* Background blobs */}
        <div className="hero-blob" style={{ width: 500, height: 500, background: '#16a34a', top: -100, left: -150 }} />
        <div className="hero-blob" style={{ width: 400, height: 400, background: '#0d9488', bottom: -80, right: -100 }} />
        <div className="hero-blob" style={{ width: 300, height: 300, background: '#f59e0b', top: 200, right: 200, opacity: 0.08 }} />

        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(74,222,128,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 30,
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.25)',
            marginBottom: 28,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} className="animate-glow" />
            <span style={{ fontSize: '0.82rem', color: '#4ade80', fontWeight: 600 }}>
              Team Neural Ninjas
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
            Turn <span className="gradient-text">Leftovers</span><br />
            Into <span style={{ color: '#f59e0b' }}>Life</span> 🌱
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: '#94a3b8',
            maxWidth: 620, margin: '0 auto 40px', lineHeight: 1.7
          }}>
            A smart food redistribution platform connecting <strong style={{ color: '#4ade80' }}>donors</strong>,{' '}
            <strong style={{ color: '#60a5fa' }}>NGOs</strong>, and{' '}
            <strong style={{ color: '#f59e0b' }}>agricultural trusts</strong> to reduce food waste and feed communities in need.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
            <Link to="/register" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', textDecoration: 'none' }}>
              🚀 Get Started Free
            </Link>
            <Link to="/map" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '1rem', textDecoration: 'none' }}>
              🗺️ View Live Map
            </Link>
          </div>

          {/* Stats bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 2, maxWidth: 700, margin: '0 auto',
          }}>
            {STATS.map(s => (
              <div key={s.label} className="glass" style={{ padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#4ade80', lineHeight: 1 }}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section style={{ padding: '80px 24px', background: 'rgba(30,41,59,0.3)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
              HOW IT WORKS
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, marginBottom: 14 }}>
              Food Saved in <span className="gradient-text">4 Simple Steps</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {STEPS.map((s, i) => (
              <div key={s.n} className="glass" style={{ padding: 28, position: 'relative', animationDelay: `${i * 0.1}s` }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'linear-gradient(135deg,#16a34a,#0d9488)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem', marginBottom: 16,
                  boxShadow: '0 4px 12px rgba(22,163,74,0.4)'
                }}>{s.icon}</div>
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(74,222,128,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.78rem', fontWeight: 800, color: '#4ade80'
                }}>{s.n}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: '#e2e8f0' }}>{s.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
              PLATFORM FEATURES
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800 }}>
              Everything You Need to <span className="gradient-text">End Food Waste</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className="donation-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: `${f.color}15`,
                  border: `1px solid ${f.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', marginBottom: 14
                }}>{f.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: f.color, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ USER ROLES ══ */}
      <section style={{ padding: '80px 24px', background: 'rgba(30,41,59,0.3)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800 }}>
              Join as <span className="gradient-text">Any Role</span>
            </h2>
            <p style={{ color: '#94a3b8', marginTop: 12, fontSize: '1rem' }}>Choose your role and start making an impact today</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { icon: '🍽️', role: 'Donor',         color: '#4ade80', desc: 'Restaurants, households & caterers list surplus food.', link: '/register?role=donor' },
              { icon: '🏢', role: 'NGO',            color: '#60a5fa', desc: 'Collect nearby food and distribute to communities.', link: '/register?role=ngo' },
              { icon: '🌾', role: 'Agri Trust',     color: '#f59e0b', desc: 'Process organic waste into compost for farming.', link: '/register?role=donor' },
              { icon: '🛡️', role: 'Admin',          color: '#a78bfa', desc: 'Monitor platform analytics and verify NGOs.', link: '/login' },
            ].map(r => (
              <Link key={r.role} to={r.link} style={{ textDecoration: 'none' }}>
                <div className="glass" style={{
                  padding: 28, textAlign: 'center', cursor: 'pointer',
                  border: `1px solid ${r.color}20`,
                  transition: 'all 0.3s ease'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${r.color}50`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${r.color}20`; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>{r.icon}</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: r.color, marginBottom: 8 }}>{r.role}</h3>
                  <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.6 }}>{r.desc}</p>
                  <p style={{ marginTop: 16, fontSize: '0.82rem', color: r.color, fontWeight: 600 }}>Register →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SDG BANNER ══ */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{
          maxWidth: 1000, margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(22,163,74,0.15), rgba(13,148,136,0.15))',
          border: '1px solid rgba(74,222,128,0.2)',
          borderRadius: 20, padding: '40px 32px', textAlign: 'center'
        }}>
          <p style={{ fontSize: '2rem', marginBottom: 12 }}>🌍 🎯 🤝</p>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12 }}>
            Aligned with <span className="gradient-text">UN Sustainable Development Goals</span>
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, margin: '20px 0' }}>
            {['SDG 1: No Poverty','SDG 2: Zero Hunger','SDG 12: Responsible Consumption','SDG 13: Climate Action','SDG 17: Partnerships'].map(s => (
              <span key={s} style={{
                padding: '6px 16px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
                background: 'rgba(74,222,128,0.1)', color: '#4ade80',
                border: '1px solid rgba(74,222,128,0.25)'
              }}>{s}</span>
            ))}
          </div>
          <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', marginTop: 8 }}>
            🌱 Join the Movement
          </Link>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{
        padding: '32px 24px',
        borderTop: '1px solid rgba(74,222,128,0.1)',
        textAlign: 'center', color: '#475569', fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: '1.2rem' }}>🌱</span>
          <span style={{ fontWeight: 700, color: '#94a3b8' }}>Leftovers to Life</span>
          <span>•</span>
          <span>Team Neural Ninjas</span>
        </div>
        <p>Built with ❤️ to fight food waste and hunger | MIT License</p>
      </footer>
    </div>
  );
}
