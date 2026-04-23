import { useState, useEffect } from 'react';
import api from '../utils/api';
import { StatCard, AnimatedCounter } from '../components/StatCard';
import Toast from '../components/Toast';

export default function AdminDashboard() {
  const [analytics, setAnalytics]   = useState(null);
  const [donations, setDonations]   = useState([]);
  const [users, setUsers]           = useState([]);
  const [ngos, setNgos]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState('overview');
  const [toast, setToast]           = useState(null);
  const [toggling, setToggling]     = useState(null); // NGO id being toggled

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [analyticsRes, donationsRes, usersRes, ngosRes] = await Promise.all([
        api.get('/api/donations/analytics'),
        api.get('/api/donations'),
        api.get('/api/users'),
        api.get('/api/ngos'),
      ]);
      setAnalytics(analyticsRes.data);
      setDonations(donationsRes.data);
      setUsers(usersRes.data);
      setNgos(ngosRes.data);
    } catch (err) {
      setToast({ message: 'Failed to fetch admin data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  /* T38 Step 7: Toggle NGO active status */
  const handleToggleNGO = async (ngoId, currentStatus) => {
    setToggling(ngoId);
    try {
      const { data } = await api.put(`/api/ngos/${ngoId}/toggle`);
      setNgos(prev => prev.map(n => n._id === ngoId ? { ...n, isActive: data.isActive } : n));
      setToast({ message: data.message, type: data.isActive ? 'success' : 'error' });
    } catch {
      setToast({ message: 'Failed to toggle NGO status', type: 'error' });
    } finally {
      setToggling(null);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', margin: '0 auto 16px',
          border: '3px solid rgba(74,222,128,0.2)', borderTopColor: '#4ade80',
          animation: 'spin 0.7s linear infinite'
        }} />
        <p style={{ color: '#64748b' }}>Loading admin data…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  const a = analytics || {};

  /* Chart-like bar */
  const ProgressBar = ({ label, value, max, color }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{label}</span>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color }}>{value}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{
          width: `${max ? (value / max) * 100 : 0}%`,
          background: `linear-gradient(90deg,${color},${color}99)`
        }} />
      </div>
    </div>
  );

  /* CO2 and meals estimation */
  const mealsServed   = a.completed * 10 || 0;
  const co2Saved      = a.wasteReducedKg * 0.4 || 0;
  const wasteComposted = a.organic * 3 || 0;

  return (
    <div style={{ minHeight: '100vh', padding: '28px 24px', maxWidth: 1280, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>
          🛡️ Admin <span className="gradient-text">Dashboard</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Platform overview and analytics</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[['overview','📊 Overview'], ['donations','🍱 Donations'], ['users','👥 Users'], ['ngos','🏢 NGOs (T38)']].map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)} style={{
            padding: '9px 20px', borderRadius: 8, border: '1.5px solid',
            borderColor: tab === v ? '#4ade80' : 'rgba(74,222,128,0.15)',
            background: tab === v ? 'rgba(74,222,128,0.12)' : 'transparent',
            color: tab === v ? '#4ade80' : '#64748b',
            fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
          }}>{l}</button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─── */}
      {tab === 'overview' && (
        <>
          {/* Key stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
            <StatCard icon="📦" label="Total"     value={a.total || 0}      color="#4ade80" />
            <StatCard icon="🟢" label="Available" value={a.available || 0}  color="#60a5fa" />
            <StatCard icon="✅" label="Completed" value={a.completed || 0}  color="#34d399" />
            <StatCard icon="♻️" label="Organic"   value={a.organic || 0}    color="#a3e635" />
            <StatCard icon="📅" label="Scheduled" value={a.scheduled || 0}  color="#f59e0b" />
            <StatCard icon="🍽️" label="Donors"    value={a.totalDonors || 0} color="#fbbf24" />
            <StatCard icon="🏢" label="NGOs"      value={a.totalNGOs || 0}  color="#a78bfa" />
          </div>

          {/* Impact numbers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
            {[
              { icon: '🍱', label: 'Meals Served', val: mealsServed,     unit: '', color: '#4ade80' },
              { icon: '🌍', label: 'CO₂ Prevented', val: co2Saved,       unit: ' kg', color: '#60a5fa' },
              { icon: '🌾', label: 'Waste Composted', val: wasteComposted, unit: ' kg', color: '#f59e0b' },
              { icon: '💰', label: 'Waste Reduced', val: a.wasteReducedKg || 0, unit: ' kg', color: '#a78bfa' },
            ].map(s => (
              <div key={s.label} className="glass" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>
                  <AnimatedCounter target={Math.floor(s.val)} suffix={s.unit} />
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 6, fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Donation status breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="glass" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '0.95rem', color: '#e2e8f0' }}>
                📊 Donation Status Breakdown
              </h3>
              <ProgressBar label="Available"  value={a.available||0}  max={a.total||1} color="#4ade80" />
              <ProgressBar label="Accepted"   value={a.accepted||0}   max={a.total||1} color="#60a5fa" />
              <ProgressBar label="Completed"  value={a.completed||0}  max={a.total||1} color="#34d399" />
              <ProgressBar label="Scheduled"  value={a.scheduled||0}  max={a.total||1} color="#f59e0b" />
              <ProgressBar label="Organic"    value={a.organic||0}    max={a.total||1} color="#a3e635" />
            </div>

            <div className="glass" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '0.95rem', color: '#e2e8f0' }}>
                🌍 UN SDG Impact Tracker
              </h3>
              {[
                { sdg: 'SDG 1 — No Poverty',        pct: Math.min(100, (mealsServed / 1000) * 100), color: '#ef4444' },
                { sdg: 'SDG 2 — Zero Hunger',        pct: Math.min(100, (a.completed||0) * 5),      color: '#f59e0b' },
                { sdg: 'SDG 12 — Responsible Use',   pct: Math.min(100, (a.organic||0) * 10),       color: '#10b981' },
                { sdg: 'SDG 13 — Climate Action',    pct: Math.min(100, co2Saved / 10),             color: '#3b82f6' },
              ].map(s => (
                <div key={s.sdg} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{s.sdg}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: s.color }}>{s.pct.toFixed(0)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${s.pct}%`,
                      background: `linear-gradient(90deg,${s.color},${s.color}99)`
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ─── DONATIONS TAB ─── */}
      {tab === 'donations' && (
        <div className="glass" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(74,222,128,0.1)' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>All Donations ({donations.length})</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Food Type</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Organic</th>
                  <th>Accepted By</th>
                  <th>Expires</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(d => (
                  <tr key={d._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{d.donor?.name || '—'}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{d.donor?.organization || ''}</div>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{d.foodType?.replace('_',' ')}</td>
                    <td>{d.quantity}</td>
                    <td><span className={`badge badge-${d.status}`}>{d.status}</span></td>
                    <td>{d.isOrganic ? <span className="badge badge-organic">♻️ Yes</span> : <span style={{ color: '#475569' }}>—</span>}</td>
                    <td style={{ color: '#94a3b8' }}>{d.acceptedBy?.name || '—'}</td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{new Date(d.expiresAt).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── USERS TAB ─── */}
      {tab === 'users' && (
        <div className="glass" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(74,222,128,0.1)' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>All Users ({users.length})</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Organization</th>
                  <th>Phone</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 7,
                          background: u.role === 'admin' ? 'rgba(167,139,250,0.2)' :
                                      u.role === 'ngo'   ? 'rgba(96,165,250,0.2)'  : 'rgba(74,222,128,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', fontWeight: 800,
                          color: u.role === 'admin' ? '#a78bfa' :
                                 u.role === 'ngo'   ? '#60a5fa' : '#4ade80'
                        }}>{u.name?.[0]?.toUpperCase()}</div>
                        <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-accepted' : u.role === 'ngo' ? 'badge-completed' : 'badge-available'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ color: '#94a3b8' }}>{u.organization || '—'}</td>
                    <td style={{ color: '#94a3b8' }}>{u.phone || '—'}</td>
                    <td style={{ color: '#64748b', fontSize: '0.78rem' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── NGO MANAGEMENT TAB (T38 Step 7) ─── */}
      {tab === 'ngos' && (
        <div className="glass" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(74,222,128,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>🏢 NGO Management — T38 Testing</h2>
              <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: 4 }}>Toggle NGOs inactive to test the "Schedule for Tomorrow" fallback on the Donor Dashboard</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ fontSize: '0.78rem', color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '4px 12px', borderRadius: 8, fontWeight: 600 }}>
                Active: {ngos.filter(n => n.isActive).length}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '4px 12px', borderRadius: 8, fontWeight: 600 }}>
                Inactive: {ngos.filter(n => !n.isActive).length}
              </span>
            </div>
          </div>

          {ngos.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>No NGOs registered yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>NGO Name</th>
                    <th>Focus Area</th>
                    <th>Service Radius</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Action (T38)</th>
                  </tr>
                </thead>
                <tbody>
                  {ngos.map(n => (
                    <tr key={n._id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{n.ngoName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{n.user?.email}</div>
                      </td>
                      <td style={{ textTransform: 'capitalize', color: '#94a3b8' }}>{n.focusArea?.replace('_', ' ')}</td>
                      <td style={{ color: '#94a3b8' }}>{n.serviceRadius} km</td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                        {n.location?.lat?.toFixed(3)}, {n.location?.lng?.toFixed(3)}
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-block', padding: '3px 12px', borderRadius: 20,
                          fontSize: '0.75rem', fontWeight: 700,
                          background: n.isActive ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
                          color: n.isActive ? '#4ade80' : '#ef4444'
                        }}>
                          {n.isActive ? '● Active' : '○ Inactive'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleNGO(n._id, n.isActive)}
                          disabled={toggling === n._id}
                          style={{
                            padding: '6px 14px', borderRadius: 8, border: '1.5px solid',
                            borderColor: n.isActive ? 'rgba(239,68,68,0.4)' : 'rgba(74,222,128,0.4)',
                            background: n.isActive ? 'rgba(239,68,68,0.1)' : 'rgba(74,222,128,0.1)',
                            color: n.isActive ? '#ef4444' : '#4ade80',
                            fontWeight: 600, fontSize: '0.78rem',
                            cursor: toggling === n._id ? 'wait' : 'pointer',
                            transition: 'all 0.2s'
                          }}>
                          {toggling === n._id ? '⏳' : n.isActive ? '🔴 Deactivate' : '🟢 Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
