import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../utils/api';
import Toast from '../components/Toast';

/* Fix leaflet default icon issue with Vite */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* Custom marker icons */
const makeIcon = (color, emoji) => L.divIcon({
  className: '',
  html: `<div style="
    width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
    background:${color};border:2px solid white;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 4px 12px rgba(0,0,0,0.3)
  "><span style="transform:rotate(45deg);font-size:16px">${emoji}</span></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -38],
});

const ICONS = {
  available: makeIcon('#22c55e', '🍱'),
  accepted:  makeIcon('#3b82f6', '🚗'),
  completed: makeIcon('#10b981', '✅'),
  expired:   makeIcon('#6b7280', '⌛'),
  organic:   makeIcon('#84cc16', '♻️'),
};

/* Auto-fit map to markers */
function FitBounds({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [coords, map]);
  return null;
}

/* Fly to user location */
function FlyToUser({ pos, trigger }) {
  const map = useMap();
  useEffect(() => {
    if (trigger) map.flyTo(pos, 15, { duration: 1.5 });
  }, [trigger, pos, map]);
  return null;
}

const STATUS_COLORS = {
  available: '#22c55e', accepted: '#3b82f6',
  completed: '#10b981', expired: '#6b7280', rejected: '#ef4444'
};

export default function MapPage() {
  const [donations, setDonations] = useState([]);
  const [filter, setFilter]       = useState('all');
  const [loading, setLoading]     = useState(true);
  const [userLoc, setUserLoc]     = useState([28.6139, 77.209]);
  const [locating, setLocating]   = useState(false);
  const [flyTrigger, setFlyTrigger] = useState(0);
  const [toast, setToast]         = useState(null);

  const goToMyLocation = () => {
    if (!navigator.geolocation) {
      setToast({ message: 'Geolocation not supported by your browser', type: 'error' }); return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setUserLoc(newPos);
        setFlyTrigger(t => t + 1);
        setLocating(false);
        setToast({ message: '📍 Centered on your location!', type: 'success' });
      },
      () => {
        setLocating(false);
        setToast({ message: 'Could not get your location. Please allow location access.', type: 'error' });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    /* Get user location on mount */
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const p = [pos.coords.latitude, pos.coords.longitude];
          setUserLoc(p);
          setFlyTrigger(1);
        },
        () => {},
        { timeout: 8000, enableHighAccuracy: true }
      );
    }

    api.get('/api/donations')
      .then(r => setDonations(r.data))
      .catch(() => setToast({ message: 'Could not load donations', type: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all'
    ? donations
    : filter === 'organic'
    ? donations.filter(d => d.isOrganic)
    : donations.filter(d => d.status === filter);

  const coords = filtered.map(d => [d.location?.lat ?? 28.6139, d.location?.lng ?? 77.209]);

  const counts = {
    all: donations.length,
    available: donations.filter(d => d.status === 'available').length,
    accepted:  donations.filter(d => d.status === 'accepted').length,
    completed: donations.filter(d => d.status === 'completed').length,
    organic:   donations.filter(d => d.isOrganic).length,
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>
            🗺️ Live <span className="gradient-text">Donation Map</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Real-time view of food donations across the city
          </p>
        </div>
        <button onClick={goToMyLocation} disabled={locating} style={{
          padding: '10px 20px', borderRadius: 10, border: '1.5px solid #f97316',
          background: locating ? 'rgba(249,115,22,0.1)' : 'rgba(249,115,22,0.15)',
          color: '#f97316', fontWeight: 700, fontSize: '0.875rem', cursor: locating ? 'wait' : 'pointer',
          display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s'
        }}>
          {locating ? '⏳ Locating…' : '📍 My Location'}
        </button>
      </div>

      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          ['all', '🗺️ All', '#94a3b8'],
          ['available', '🟢 Available', '#4ade80'],
          ['accepted',  '🔵 In Transit', '#60a5fa'],
          ['completed', '✅ Completed', '#34d399'],
          ['organic',   '♻️ Organic', '#a3e635'],
        ].map(([v, l, c]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            padding: '8px 16px', borderRadius: 8, border: '1.5px solid',
            borderColor: filter === v ? c : 'rgba(74,222,128,0.15)',
            background: filter === v ? `${c}20` : 'transparent',
            color: filter === v ? c : '#64748b',
            fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s'
          }}>
            {l} <span style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '1px 7px', fontSize: '0.72rem' }}>
              {counts[v] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Map */}
      <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(74,222,128,0.15)', height: 540 }}>
        {loading ? (
          <div style={{
            height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#1e293b', flexDirection: 'column', gap: 12
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '3px solid rgba(74,222,128,0.2)', borderTopColor: '#4ade80',
              animation: 'spin 0.7s linear infinite'
            }} />
            <p style={{ color: '#64748b' }}>Loading map…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <MapContainer center={userLoc} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            <FlyToUser pos={userLoc} trigger={flyTrigger} />
            {coords.length > 0 && <FitBounds coords={coords} />}

            {/* User location — pulsing marker */}
            <Marker position={userLoc} icon={L.divIcon({
              className: '',
              html: `<div style="position:relative;width:20px;height:20px">
                <div style="position:absolute;inset:0;border-radius:50%;background:#f97316;opacity:0.3;animation:pulse 1.5s ease-out infinite"></div>
                <div style="position:absolute;inset:4px;border-radius:50%;background:#f97316;border:2px solid white"></div>
                <style>@keyframes pulse{0%{transform:scale(1);opacity:0.3}100%{transform:scale(2.5);opacity:0}}</style>
              </div>`,
              iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -14]
            })}>
              <Popup>
                <div style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, padding: 4 }}>
                  📍 <strong>Your Current Location</strong><br/>
                  <span style={{fontSize:'0.75rem',color:'#666'}}>{userLoc[0].toFixed(5)}, {userLoc[1].toFixed(5)}</span>
                </div>
              </Popup>
            </Marker>
            <Circle center={userLoc} radius={5000}
              pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.05, weight: 1.5, dashArray: '6 4' }} />

            {/* Donation markers */}
            {filtered.map(d => {
              const lat  = d.location?.lat ?? 28.6139;
              const lng  = d.location?.lng ?? 77.209;
              const icon = d.isOrganic ? ICONS.organic : ICONS[d.status] || ICONS.available;
              return (
                <Marker key={d._id} position={[lat, lng]} icon={icon}>
                  <Popup>
                    <div style={{ fontFamily: 'Inter,sans-serif', minWidth: 180 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.9rem', textTransform: 'capitalize' }}>
                        {d.foodType?.replace('_', ' ')} {d.isOrganic ? '♻️' : ''}
                      </div>
                      <div style={{ color: '#555', fontSize: '0.82rem', marginBottom: 6 }}>
                        By: {d.donor?.name || 'Unknown'}<br />
                        Qty: {d.quantity}<br />
                        📍 {d.address?.slice(0, 40)}
                      </div>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                        fontSize: '0.72rem', fontWeight: 700,
                        background: `${STATUS_COLORS[d.status]}20`, color: STATUS_COLORS[d.status]
                      }}>{d.status}</span>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap',
        padding: '12px 16px', borderRadius: 10,
        background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(74,222,128,0.1)'
      }}>
        {[
          ['🍱 Available', '#22c55e'],
          ['🚗 Accepted', '#3b82f6'],
          ['✅ Completed', '#10b981'],
          ['♻️ Organic', '#84cc16'],
          ['📍 Your Loc', '#f97316'],
        ].map(([l, c]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>{l}</span>
          </div>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#475569' }}>
          Showing {filtered.length} of {donations.length} donations
        </span>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
