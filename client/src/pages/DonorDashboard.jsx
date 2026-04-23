import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import DonationCard from '../components/DonationCard';
import { StatCard } from '../components/StatCard';
import Toast from '../components/Toast';

const FOOD_TYPES = ['cooked', 'packaged', 'raw', 'organic_waste', 'mixed'];

const emptyForm = {
  foodType: 'cooked', quantity: '', description: '', address: '',
  expiresAt: '', isOrganic: false,
  location: { lat: 28.6139, lng: 77.209 },
};

export default function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [form, setForm]                 = useState(emptyForm);
  const [submitting, setSubmitting]     = useState(false);
  const [toast, setToast]               = useState(null);
  const [tab, setTab]                   = useState('all');

  // T38 — NGO availability state
  const [ngoAlert, setNgoAlert]         = useState(null); // { donationId, nearbyCount }
  const [scheduling, setScheduling]     = useState(false);
  const [nearbyNGOs, setNearbyNGOs]     = useState([]);

  const fetchDonations = async () => {
    try {
      const { data } = await api.get('/api/donations/my');
      setDonations(data);
    } catch {
      setToast({ message: 'Failed to fetch donations', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonations(); }, []);

  /* T38 Step 2-4: Check nearby active NGOs after posting */
  const checkNearbyNGOs = async (donationId, lat, lng) => {
    try {
      const { data } = await api.get(`/api/ngos/nearby?lat=${lat}&lng=${lng}&radius=10`);
      setNearbyNGOs(data.ngos || []);
      if (!data.hasAvailable) {
        // Step 5: show fallback
        setNgoAlert({ donationId, nearbyCount: 0 });
      } else {
        setToast({ message: `✅ ${data.count} NGO(s) notified nearby!`, type: 'success' });
      }
    } catch {
      // silently skip — don't block the donation post
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    let lat = 28.6139, lng = 77.209;
    try {
      /* Get geolocation */
      if (navigator.geolocation) {
        await new Promise((res) =>
          navigator.geolocation.getCurrentPosition(
            (pos) => { lat = pos.coords.latitude; lng = pos.coords.longitude; res(); },
            res, { timeout: 3000 }
          )
        );
      }
      form.location = { lat, lng };
      const { data } = await api.post('/api/donations', form);
      setToast({ message: '🎉 Donation posted successfully!', type: 'success' });
      setShowModal(false);
      setForm(emptyForm);
      fetchDonations();

      // T38: check NGO availability right after posting
      setNgoAlert(null);
      await checkNearbyNGOs(data._id, lat, lng);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to post donation', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  /* T38 Step 5-6: Schedule for Tomorrow */
  const handleSchedule = async () => {
    if (!ngoAlert?.donationId) return;
    setScheduling(true);
    try {
      const { data } = await api.put(`/api/donations/${ngoAlert.donationId}/schedule`);
      setNgoAlert(null);
      fetchDonations();
      setToast({ message: `📅 Scheduled for tomorrow at 8:00 AM!`, type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to schedule', type: 'error' });
    } finally {
      setScheduling(false);
    }
  };

  /* Stats */
  const total     = donations.length;
  const active    = donations.filter(d => d.status === 'available').length;
  const accepted  = donations.filter(d => d.status === 'accepted').length;
  const completed = donations.filter(d => d.status === 'completed').length;
  const scheduled = donations.filter(d => d.status === 'scheduled').length;

  /* Filter */
  const filtered = tab === 'all' ? donations
    : tab === 'active'    ? donations.filter(d => ['available','accepted'].includes(d.status))
    : tab === 'scheduled' ? donations.filter(d => d.status === 'scheduled')
    : donations.filter(d => d.status === 'completed');

  const minDate = new Date(Date.now() + 30 * 60000).toISOString().slice(0, 16);

  return (
    <div style={{ minHeight: '100vh', padding: '28px 24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>
            👋 Hello, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {user?.organization && `${user.organization} • `}Donor Dashboard
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" id="add-donation-btn">
          ➕ Post Donation
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon="📦" label="Total"     value={total}     color="#4ade80" />
        <StatCard icon="🟢" label="Active"    value={active}    color="#60a5fa" />
        <StatCard icon="🚗" label="Picked Up" value={accepted}  color="#f59e0b" />
        <StatCard icon="✅" label="Completed" value={completed} color="#34d399" />
        <StatCard icon="📅" label="Scheduled" value={scheduled} color="#a78bfa" />
      </div>

      {/* Impact banner */}
      {completed > 0 && (
        <div style={{
          padding: '16px 24px', borderRadius: 14, marginBottom: 24,
          background: 'linear-gradient(135deg,rgba(22,163,74,0.15),rgba(13,148,136,0.15))',
          border: '1px solid rgba(74,222,128,0.2)',
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🌍</span>
          <div>
            <p style={{ fontWeight: 700, color: '#4ade80', fontSize: '0.9rem' }}>Your Impact So Far</p>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
              ~{completed * 5} kg food saved · ~{completed * 2} kg CO₂ reduced · ~{completed * 10} meals provided
            </p>
          </div>
        </div>
      )}

      {/* ── T38 Step 5: No NGO Available Banner ── */}
      {ngoAlert && (
        <div style={{
          padding: '20px 24px', borderRadius: 14, marginBottom: 24,
          background: 'rgba(251,191,36,0.08)',
          border: '1.5px solid rgba(251,191,36,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '2rem' }}>⚠️</span>
            <div>
              <p style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.95rem', marginBottom: 4 }}>
                No NGOs available right now
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                No active NGOs found within 10 km of your location. Your donation is saved.
                <br />Schedule it for tomorrow and we'll automatically notify NGOs at 8:00 AM.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setNgoAlert(null)} style={{
              padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(100,116,139,0.3)',
              background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: '0.85rem'
            }}>
              Dismiss
            </button>
            <button onClick={handleSchedule} disabled={scheduling} style={{
              padding: '10px 20px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg,#f59e0b,#d97706)',
              color: '#0f172a', fontWeight: 700, fontSize: '0.875rem',
              cursor: scheduling ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 8
            }}>
              {scheduling ? '⏳ Scheduling…' : '📅 Schedule for Tomorrow'}
            </button>
          </div>
        </div>
      )}

      {/* Nearby NGOs preview (when available) */}
      {nearbyNGOs.length > 0 && !ngoAlert && (
        <div style={{
          padding: '14px 20px', borderRadius: 12, marginBottom: 20,
          background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)',
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '1.2rem' }}>🏢</span>
          <p style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>
            {nearbyNGOs.length} NGO(s) notified within 10 km:&nbsp;
            <span style={{ color: '#94a3b8', fontWeight: 400 }}>
              {nearbyNGOs.slice(0, 3).map(n => n.ngoName).join(', ')}
              {nearbyNGOs.length > 3 && ` +${nearbyNGOs.length - 3} more`}
            </span>
          </p>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['all','All'], ['active','Active'], ['scheduled','📅 Scheduled'], ['completed','Completed']].map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)} style={{
            padding: '8px 18px', borderRadius: 8, border: '1.5px solid',
            borderColor: tab === v ? '#4ade80' : 'rgba(74,222,128,0.15)',
            background: tab === v ? 'rgba(74,222,128,0.12)' : 'transparent',
            color: tab === v ? '#4ade80' : '#64748b',
            fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s'
          }}>{l}</button>
        ))}
      </div>

      {/* Donation list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>⏳ Loading donations…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <p style={{ fontSize: '3rem', marginBottom: 12 }}>🍱</p>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            {tab === 'scheduled' ? 'No scheduled donations.' : 'No donations yet. Post your first one!'}
          </p>
          {tab !== 'scheduled' && (
            <button onClick={() => setShowModal(true)} className="btn-primary" style={{ marginTop: 20 }}>
              ➕ Post Donation
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(d => (
            <div key={d._id} style={{ position: 'relative' }}>
              <DonationCard donation={d} role="donor" />
              {d.status === 'scheduled' && (
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.4)',
                  borderRadius: 8, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700, color: '#a78bfa'
                }}>
                  📅 Scheduled: {new Date(d.scheduledFor).toLocaleDateString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Add Donation Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>🍱 Post New Donation</h2>
              <button onClick={() => setShowModal(false)} style={{
                background: 'none', border: 'none', color: '#64748b', fontSize: '1.3rem', cursor: 'pointer'
              }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, display: 'block' }}>Food Type *</label>
                <select name="foodType" value={form.foodType}
                  onChange={e => setForm({ ...form, foodType: e.target.value })}
                  className="input-field" id="donation-food-type">
                  {FOOD_TYPES.map(t => (
                    <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, display: 'block' }}>Quantity *</label>
                <input type="text" value={form.quantity} required
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                  className="input-field" placeholder="e.g. 10 kg, 50 portions, 5 boxes" id="donation-quantity" />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, display: 'block' }}>Description</label>
                <textarea value={form.description} rows={2}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="input-field" placeholder="e.g. Dal, rice, sabzi — freshly cooked"
                  id="donation-description" style={{ resize: 'vertical' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, display: 'block' }}>Pickup Address *</label>
                <input type="text" value={form.address} required
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="input-field" placeholder="Full pickup address" id="donation-address" />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, display: 'block' }}>Expiry Date & Time *</label>
                <input type="datetime-local" value={form.expiresAt} min={minDate} required
                  onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                  className="input-field" id="donation-expiry" />
              </div>

              <label style={{
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                padding: '10px 14px', borderRadius: 10,
                background: form.isOrganic ? 'rgba(132,204,22,0.1)' : 'rgba(15,23,42,0.4)',
                border: `1.5px solid ${form.isOrganic ? 'rgba(132,204,22,0.4)' : 'rgba(74,222,128,0.1)'}`,
                transition: 'all 0.2s'
              }}>
                <input type="checkbox" checked={form.isOrganic}
                  onChange={e => setForm({ ...form, isOrganic: e.target.checked })}
                  style={{ width: 16, height: 16 }} id="donation-organic" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: form.isOrganic ? '#a3e635' : '#94a3b8' }}>
                  ♻️ This is organic waste (route to agricultural trusts)
                </span>
              </label>

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 2, justifyContent: 'center' }}>
                  {submitting ? '⏳ Posting…' : '🚀 Post Donation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
