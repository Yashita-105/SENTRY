import React from 'react';
import { Activity, Radio, AlertTriangle, Navigation, ChevronRight } from 'lucide-react';

export default function AlertsLog({ logs = [], onSelectLog }) {
  return (
    <div className="glass-panel" style={{ padding: '16px', borderRadius: '8px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Activity size={17} color="var(--color-primary)" /><h3 style={{ fontSize: '.9rem' }}>MESH EVENT FEED</h3></div>
        <span style={{ fontSize: '.65rem', color: 'var(--text-muted)' }}>{logs.length} events</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', maxHeight: 280, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {logs.length === 0 ? <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20, fontSize: '.78rem' }}>No events.</div> : logs.map((item, idx) => {
          const isAlert = item.type === 'ALERT' || item.level === 'CRITICAL' || item.level === 'WARNING';
          const isDrone = item.type === 'DRONE';
          return (
            <button key={`${item.timestamp}-${idx}`} onClick={() => item.nodeId && onSelectLog?.(item)} style={{
              display: 'flex', alignItems: 'flex-start', gap: 9, textAlign: 'left', width: '100%', cursor: item.nodeId ? 'pointer' : 'default',
              padding: '8px 10px', borderRadius: 7, background: isAlert ? 'rgba(239,68,68,.08)' : isDrone ? 'rgba(56,189,248,.06)' : 'rgba(255,255,255,.02)',
              border: `1px solid ${isAlert ? 'rgba(239,68,68,.25)' : 'var(--border-color)'}`, color: 'var(--text-main)'
            }}>
              {isAlert ? <AlertTriangle size={14} color={item.level === 'CRITICAL' ? 'var(--color-danger)' : 'var(--color-warning)'}/> : isDrone ? <Navigation size={14} color="var(--color-primary)"/> : <Radio size={14} color="var(--color-success)"/>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: '.64rem', color: 'var(--text-muted)' }}><span>{item.source}</span><span>{item.timestamp}</span></div>
                <div style={{ marginTop: 2, fontSize: '.73rem', lineHeight: 1.35 }}>{item.message}</div>
              </div>
              {item.nodeId && <ChevronRight size={14} color="var(--text-muted)"/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
