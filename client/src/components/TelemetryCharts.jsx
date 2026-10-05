import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Thermometer, Waves, Wind } from 'lucide-react';

export default function TelemetryCharts({ historyData = [] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '20px' }}>
      
      {/* Temperature Trend Chart */}
      <div className="glass-panel" style={{ padding: '16px', borderRadius: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Thermometer size={18} color="var(--color-danger)" />
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.04em' }}>
            TEMPERATURE (°C)
          </h3>
        </div>

        <div style={{ height: '140px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData.slice(-10)}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#6b7280" tick={{ fontSize: 10 }} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#6b7280" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0e121b', border: '1px solid #ef4444', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#tempGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Water Level Trend Chart */}
      <div className="glass-panel" style={{ padding: '16px', borderRadius: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Waves size={18} color="var(--color-primary)" />
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.04em' }}>
            WATER LEVEL (m)
          </h3>
        </div>

        <div style={{ height: '140px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData.slice(-10)}>
              <defs>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#6b7280" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 6]} stroke="#6b7280" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0e121b', border: '1px solid #00f0ff', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="waterLevel" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#waterGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Wind Speed Trend Chart */}
      <div className="glass-panel" style={{ padding: '16px', borderRadius: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Wind size={18} color="var(--color-warning)" />
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.04em' }}>
            WIND SPEED (km/h)
          </h3>
        </div>

        <div style={{ height: '140px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData.slice(-10)}>
              <defs>
                <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#6b7280" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 50]} stroke="#6b7280" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0e121b', border: '1px solid #f59e0b', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="windSpeed" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#windGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
