import React from 'react';
import { Thermometer, Waves, Wind, Battery, Signal, MapPin, Send, Radio, ShieldAlert } from 'lucide-react';

export default function NodeCard({ node, onDispatchDrone, isSelected, onSelectNode }) {
  const critical = node.status === 'CRITICAL';
  const warning = node.status === 'WARNING';

  return (
    <div className={`glass-panel ${isSelected ? 'glass-panel-active' : ''}`} onClick={() => onSelectNode?.(node)} style={{
      padding: 18, cursor: 'pointer', borderLeft: `4px solid ${critical ? 'var(--color-danger)' : warning ? 'var(--color-warning)' : 'var(--color-success)'}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-primary)' }}>{node.id}</span>
            <span className={`badge-status ${critical ? 'badge-critical' : warning ? 'badge-warning' : 'badge-normal'}`}>{node.status}</span>
          </div>
          <h3 style={{ fontSize: '.92rem', marginTop: 5 }}>{node.name}</h3>
        </div>
        <button className="btn-hud btn-hud-primary" onClick={e => { e.stopPropagation(); onDispatchDrone?.(node.id); }} style={{ padding: '6px 9px', fontSize: '.7rem' }}><Send size={12}/>Dispatch</button>
      </div>

      {node.hazard && <div style={{ display: 'flex', gap: 6, marginTop: 8, fontSize: '.72rem', color: critical ? 'var(--color-danger)' : warning ? 'var(--color-warning)' : 'var(--text-muted)' }}><ShieldAlert size={13}/>{node.hazard}</div>}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '12px 0', padding: '6px 9px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: '.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}><MapPin size={13} color="var(--color-primary)"/>{node.lat.toFixed(4)}°N, {node.lng.toFixed(4)}°E</div>

      <div style={{ fontSize: '.66rem', color: 'var(--text-muted)', marginBottom: 7, fontWeight: 700 }}>EDGE SENSORS</div>
      <div className="node-card-sensors" style={{ display: 'grid', gap: 7 }}>
        <Metric icon={<Radio size={12}/>} label="PIR" value={node.pir ?? (warning || critical ? 'TRIGGER' : 'CLEAR')} />
        <Metric icon={<Waves size={12}/>} label="SEISMIC" value={node.seismic ?? (warning || critical ? 'HIGH' : 'LOW')} />
        <Metric icon={<Thermometer size={12}/>} label="THERMAL" value={node.thermal ?? `${node.temp}°C`} />
        <Metric icon={<Signal size={12}/>} label="LIDAR" value={node.lidar ?? 'ACTIVE'} />
      </div>

      <div className="node-card-metrics" style={{ display: 'grid', gap: 7, marginTop: 7 }}>
        <Metric icon={<Battery size={12}/>} label="BATTERY" value={`${node.battery}%`} />
        <Metric icon={<Signal size={12}/>} label="RSSI" value={`${node.rssi} dBm`} />
        <Metric icon={<Wind size={12}/>} label="WIND" value={`${node.windSpeed} km/h`} />
      </div>

      <div style={{ marginTop: 11, fontSize: '.68rem', color: 'var(--text-muted)' }}>
        <strong style={{ color: 'var(--text-main)' }}>Mesh neighbours:</strong> {(node.meshNeighbors || []).join(' • ') || '—'}
      </div>
    </div>
  );
}

function Metric({ icon, label, value }) {
  return <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 5, padding: '7px 6px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '.58rem' }}>{icon}{label}</div><div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '.7rem', marginTop: 3 }}>{value}</div></div>;
}
