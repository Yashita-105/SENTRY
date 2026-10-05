import React, { useEffect, useState } from 'react';
import { ShieldCheck, Cpu, Navigation, RefreshCw, Layers, BarChart2, List, Building2, Sun, Moon } from 'lucide-react';

export default function HeaderHUD({
  nodes = [], drone = {}, baseStation = {}, isSimulating, onToggleSimulator,
  onRefreshData, activeTab, setActiveTab, theme = 'dark', onToggleTheme,
  connectionState = 'SIMULATION'
}) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const criticalCount = nodes.filter(n => n.status === 'CRITICAL').length;
  const warningCount = nodes.filter(n => n.status === 'WARNING').length;

  return (
    <header className="glass-panel" style={{ padding: '18px 24px', marginBottom: '20px', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '6px', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Navigation size={20} style={{ transform: 'rotate(45deg)' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.02em', color: 'var(--text-main)' }}>
                SENTRY <span style={{ color: 'var(--color-primary)', fontWeight: '500', fontSize: '0.9rem' }}>| BORDER SURVEILLANCE CONTROL CENTER</span>
              </h1>
              <span className="badge-status badge-normal"><span className="pulse-dot"></span>SYSTEM ONLINE</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Self-healing field mesh • live telemetry • operator-controlled UAV dispatch
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-dark)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <Building2 size={15} color="var(--color-base)" />
            <div><div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '600' }}>GATEWAY / HQ</div><div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-base)' }}>ONLINE</div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-dark)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <Cpu size={15} color="var(--color-primary)" />
            <div><div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '600' }}>FIELD NODES</div><div style={{ fontSize: '0.82rem', fontWeight: '700' }}>{nodes.length} <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: '400' }}>active</span></div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: criticalCount ? 'var(--color-danger-bg)' : 'var(--bg-dark)', padding: '6px 12px', borderRadius: '6px', border: criticalCount ? '1px solid rgba(239,68,68,.4)' : '1px solid var(--border-color)' }}>
            <ShieldCheck size={15} color={criticalCount ? 'var(--color-danger)' : warningCount ? 'var(--color-warning)' : 'var(--color-success)'} />
            <div><div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '600' }}>ALERT STATUS</div><div style={{ fontSize: '0.82rem', fontWeight: '700', color: criticalCount ? 'var(--color-danger)' : warningCount ? 'var(--color-warning)' : 'var(--color-success)' }}>{criticalCount ? `${criticalCount} Critical` : warningCount ? `${warningCount} Warning` : 'NORMAL'}</div></div>
          </div>
          <button className="btn-hud btn-hud-secondary" onClick={onToggleTheme} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>{theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}{theme === 'dark' ? 'Light' : 'Dark'}</button>
          <div style={{ textAlign: 'right', borderLeft: '1px solid var(--border-color)', paddingLeft: '14px', minWidth: '110px' }}><div style={{ fontSize: '0.88rem', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{time}</div><div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{date}</div></div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className={`btn-hud ${activeTab === 'MAP' ? 'btn-hud-primary' : 'btn-hud-secondary'}`} onClick={() => setActiveTab('MAP')}><Layers size={15} />LIVE MAP</button>
          <button className={`btn-hud ${activeTab === 'NODES' ? 'btn-hud-primary' : 'btn-hud-secondary'}`} onClick={() => setActiveTab('NODES')}><Cpu size={15} />FIELD NODES ({nodes.length})</button>
          <button className={`btn-hud ${activeTab === 'ANALYTICS' ? 'btn-hud-primary' : 'btn-hud-secondary'}`} onClick={() => setActiveTab('ANALYTICS')}><BarChart2 size={15} />TELEMETRY</button>
          <button className={`btn-hud ${activeTab === 'LOGS' ? 'btn-hud-primary' : 'btn-hud-secondary'}`} onClick={() => setActiveTab('LOGS')}><List size={15} />EVENTS</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-dark)', padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <label className="switch"><input type="checkbox" checked={isSimulating} onChange={onToggleSimulator} /><span className="slider"></span></label>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: isSimulating ? 'var(--color-primary)' : 'var(--color-success)' }}>{isSimulating ? 'DEMO SIMULATION' : `LIVE SERVER ${connectionState}`}</span>
          </div>
          <button className="btn-hud btn-hud-secondary" onClick={onRefreshData}><RefreshCw size={14} />Refresh</button>
        </div>
      </div>
    </header>
  );
}
