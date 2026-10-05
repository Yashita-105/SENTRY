import { Navigation, Send, RotateCcw, Pause, Radio, MapPin, Target, Gauge, Battery, Compass } from 'lucide-react';

export default function DroneHUD({ drone = {}, selectedNode, onDispatchDrone, onCommandDrone }) {
  const target = selectedNode || (drone.targetNodeId ? { id: drone.targetNodeId, lat: drone.targetLat, lng: drone.targetLng } : null);
  const canDispatch = target && drone.status !== 'DISPATCHED';

  return (
    <div className="glass-panel" style={{ padding: '18px', borderRadius: '8px', height: '560px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}><Navigation size={18} color="var(--color-primary)" /><strong>DRONE MISSION CONTROL</strong></div>
        <span className={`badge-status ${drone.status === 'DISPATCHED' ? 'badge-warning' : drone.status === 'HOVERING' ? 'badge-normal' : 'badge-base'}`}>{drone.status || 'STANDBY'}</span>
      </div>

      <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '14px', marginBottom: '14px' }}>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '5px' }}>ACTIVE TARGET</div>
        {target ? <><div style={{ fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>{target.id}</div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>{Number(target.lat).toFixed(5)}°N, {Number(target.lng).toFixed(5)}°E</div></> : <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Select a warning/critical mesh node on the map.</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
        <Metric icon={<MapPin size={14}/>} label="GPS" value={`${Number(drone.lat || 0).toFixed(5)}, ${Number(drone.lng || 0).toFixed(5)}`} />
        <Metric icon={<Gauge size={14}/>} label="SPEED" value={`${Number(drone.speed || 0).toFixed(1)} m/s`} />
        <Metric icon={<Compass size={14}/>} label="HEADING" value={`${Math.round(drone.heading || 0)}°`} />
        <Metric icon={<Battery size={14}/>} label="BATTERY" value={`${Math.round(drone.battery || 0)}%`} />
        <Metric icon={<Radio size={14}/>} label="ALTITUDE" value={`${Math.round(drone.altitude || 0)} m`} />
        <Metric icon={<Target size={14}/>} label="MISSION" value={drone.targetNodeId || 'NONE'} />
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px' }}>OPERATOR ACTION</div>
        <button className="btn-hud btn-hud-primary" disabled={!canDispatch} onClick={() => onDispatchDrone(target.id)} style={{ width: '100%', justifyContent: 'center', padding: '10px', marginBottom: '8px', opacity: canDispatch ? 1 : .5 }}><Send size={15}/>{drone.status === 'DISPATCHED' ? 'DRONE EN ROUTE' : target ? `DISPATCH TO ${target.id}` : 'SELECT ALERT NODE'}</button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button className="btn-hud btn-hud-secondary" onClick={() => onCommandDrone('HOVER')} disabled={drone.status === 'STANDBY'}><Pause size={14}/>Hover</button>
          <button className="btn-hud btn-hud-secondary" onClick={() => onCommandDrone('RTL')}><RotateCcw size={14}/>Return HQ</button>
        </div>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }) {
  return <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '9px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.65rem' }}>{icon}{label}</div><div style={{ marginTop: '4px', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-main)' }}>{value}</div></div>;
}
