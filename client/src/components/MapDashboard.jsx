import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, MapPinned, Network, Send, Radio } from 'lucide-react';

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;
const DEFAULT_MAP_API = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
const MAPTILER_URL = MAPTILER_KEY ? `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}` : DEFAULT_MAP_API;

const statusColor = status => status === 'CRITICAL' ? '#dc2626' : status === 'WARNING' ? '#d97706' : '#15803d';

function createBaseIcon() {
  return L.divIcon({ className:'map-hq-pin', html:'<div style="width:34px;height:34px;border-radius:8px;background:#1f2937;border:2px solid #94a3b8;display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;font-weight:800;box-shadow:0 3px 10px rgba(0,0,0,.28)">HQ</div>', iconSize:[34,34], iconAnchor:[17,17] });
}

function createNodeIcon(node, selected) {
  const color = statusColor(node.status);
  return L.divIcon({
    className:'map-node-pin',
    html:`<div style="position:relative;width:30px;height:30px;border-radius:50%;background:#fff;border:3px solid ${color};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(15,23,42,.35),${selected ? `0 0 0 4px ${color}33` : 'none'}"><div style="width:9px;height:9px;border-radius:50%;background:${color}"></div>${node.status !== 'NORMAL' ? `<span style="position:absolute;inset:-7px;border:1.5px solid ${color};border-radius:50%;opacity:.55"></span>` : ''}</div>`,
    iconSize:[30,30], iconAnchor:[15,15]
  });
}

function createDroneIcon(heading=0) {
  return L.divIcon({ className:'map-drone-pin', html:`<div style="width:36px;height:36px;border-radius:50%;background:#2563eb;border:3px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(37,99,235,.45);transform:rotate(${heading}deg)"><span style="color:#fff;font-size:18px">▲</span></div>`, iconSize:[36,36], iconAnchor:[18,18] });
}

function FitMap({ positions, selectedNode }) {
  const map = useMap();
  const didFit = useRef(false);
  useEffect(() => { if (!didFit.current && positions.length) { map.fitBounds(positions, { padding:[45,45], maxZoom:13 }); didFit.current=true; } }, [map, positions]);
  useEffect(() => { if (selectedNode?.lat && selectedNode?.lng) map.flyTo([selectedNode.lat, selectedNode.lng], Math.max(map.getZoom(), 14), { duration:.6 }); }, [map, selectedNode?.id]);
  return null;
}

export default function MapDashboard({ nodes=[], drone={}, baseStation={}, selectedNode, onSelectNode, onDispatchDrone, theme='dark' }) {
  const basePos = [Number(baseStation.lat || 32.2396), Number(baseStation.lng || 77.1887)];
  const dronePos = [Number(drone.lat || basePos[0]), Number(drone.lng || basePos[1])];
  const positions = useMemo(() => [basePos, ...nodes.filter(n=>Number.isFinite(Number(n.lat)) && Number.isFinite(Number(n.lng))).map(n=>[Number(n.lat),Number(n.lng)])], [baseStation.lat, baseStation.lng, nodes]);
  const meshLinks = useMemo(() => {
    const seen = new Set(); const links=[];
    nodes.forEach(node => (node.meshNeighbors||[]).forEach(id => { const other=nodes.find(n=>n.id===id); if(!other)return; const key=[node.id,other.id].sort().join(':'); if(seen.has(key))return; seen.add(key); links.push([node,other]); }));
    const firstByMesh = new Map();
    nodes.forEach(node => { if (!firstByMesh.has(node.meshId)) firstByMesh.set(node.meshId, node); });
    firstByMesh.forEach(node => links.push([null,node]));
    return links;
  }, [nodes]);
  const flightPath = drone.targetLat != null && drone.targetLng != null ? [dronePos,[Number(drone.targetLat),Number(drone.targetLng)]] : [];

  return <div className="map-dashboard glass-panel" style={{height:'100%',minHeight:'420px',width:'100%',position:'relative',overflow:'hidden',borderRadius:'10px'}}>
    <div style={{position:'absolute',top:14,left:14,zIndex:1000,display:'flex',gap:8,flexWrap:'wrap'}}>
      <div style={{background:'var(--bg-card)',border:'1px solid var(--border-color)',borderRadius:7,padding:'8px 11px',fontSize:'.72rem',boxShadow:'var(--shadow-md)',display:'flex',alignItems:'center',gap:7}}><Network size={14} color="var(--color-primary)"/> Mesh topology <strong>{nodes.length} nodes</strong></div>
      <div style={{background:'var(--bg-card)',border:'1px solid var(--border-color)',borderRadius:7,padding:'8px 11px',fontSize:'.7rem',boxShadow:'var(--shadow-md)'}}><span style={{color:'#15803d'}}>● Normal</span><span style={{marginLeft:10,color:'#d97706'}}>● Warning</span><span style={{marginLeft:10,color:'#dc2626'}}>● Critical</span></div>
    </div>
    <div style={{position:'absolute',bottom:14,left:14,zIndex:1000,background:'var(--bg-card)',border:'1px solid var(--border-color)',borderRadius:7,padding:'8px 11px',fontSize:'.7rem',boxShadow:'var(--shadow-md)',display:'flex',alignItems:'center',gap:7}}><Radio size={13} color="var(--color-success)"/> Live telemetry <span style={{color:'var(--text-muted)'}}>• GPS / mesh / UAV updates</span></div>
    {drone.targetNodeId && <div style={{position:'absolute',bottom:14,right:14,zIndex:1000,background:'var(--bg-card)',border:'1px solid #93c5fd',borderRadius:7,padding:'8px 11px',fontSize:'.7rem',boxShadow:'var(--shadow-md)'}}><strong style={{color:'var(--color-primary)'}}>MISSION</strong> {drone.id} → {drone.targetNodeId} · {drone.status}</div>}

    <MapContainer center={[32.285,77.175]} zoom={11} minZoom={2} maxZoom={19} worldCopyJump={true} scrollWheelZoom style={{height:'100%',width:'100%'}}>
      <TileLayer attribution={MAPTILER_KEY ? '&copy; MapTiler &copy; OpenStreetMap contributors' : 'Tiles &copy; Esri — Source: Esri, OpenStreetMap contributors'} url={MAPTILER_URL} minZoom={2} maxZoom={19} maxNativeZoom={19} noWrap={false} updateWhenZooming={false} updateWhenIdle={true} />
      <FitMap positions={positions} selectedNode={selectedNode}/>
      {meshLinks.map(([a,b],i)=>{ const from=a?[a.lat,a.lng]:basePos; const to=[b.lat,b.lng]; const degraded=(a&&a.status!=='NORMAL')||b.status!=='NORMAL'; return <Polyline key={`mesh-${i}`} positions={[from,to]} pathOptions={{color:degraded?'#d97706':'#64748b',weight:2,opacity:.65,dashArray:'6 7'}}/>; })}
      <Marker position={basePos} icon={createBaseIcon()}><Popup><div style={{padding:5,minWidth:190}}><strong>SENTRY GATEWAY / HQ</strong><div style={{fontSize:11,marginTop:5,color:'var(--text-muted)'}}>Primary gateway and operator control point<br/>{basePos[0].toFixed(5)}°N, {basePos[1].toFixed(5)}°E</div></div></Popup></Marker>
      {nodes.map(node=><React.Fragment key={node.id}>
        <Marker position={[Number(node.lat),Number(node.lng)]} icon={createNodeIcon(node,selectedNode?.id===node.id)} eventHandlers={{click:()=>onSelectNode?.(node)}}>
          <Popup><div style={{padding:5,width:250}}><div style={{display:'flex',justifyContent:'space-between',gap:8}}><strong>{node.id}</strong><span className={`badge-status ${node.status==='CRITICAL'?'badge-critical':node.status==='WARNING'?'badge-warning':'badge-normal'}`}>{node.status}</span></div><div style={{fontWeight:700,marginTop:6}}>{node.name}</div><div style={{fontSize:11,color:'var(--text-muted)',marginTop:5}}>{node.hazard||'No active threshold breach'}</div><div style={{fontSize:10,fontFamily:'var(--font-mono)',marginTop:7}}>{Number(node.lat).toFixed(5)}°N, {Number(node.lng).toFixed(5)}°E</div><button className="btn-hud btn-hud-primary" onClick={()=>onDispatchDrone?.(node.id)} style={{width:'100%',marginTop:10}}><Send size={13}/> Dispatch drone</button></div></Popup>
        </Marker>
        {node.status==='CRITICAL' && <Circle center={[node.lat,node.lng]} radius={220} pathOptions={{color:'#dc2626',fillColor:'#dc2626',fillOpacity:.06,weight:1.5,dashArray:'5 5'}}/>}
      </React.Fragment>)}
      {drone.trackingEnabled!==false && <Marker position={dronePos} icon={createDroneIcon(drone.heading)}><Popup><div style={{padding:5,minWidth:175}}><strong style={{color:'var(--color-primary)'}}>{drone.id}</strong><div style={{fontSize:11,marginTop:6}}>Status: {drone.status}<br/>Altitude: {Math.round(drone.altitude||0)} m<br/>Speed: {Number(drone.speed||0).toFixed(1)} m/s<br/>Battery: {Math.round(drone.battery||0)}%</div></div></Popup></Marker>}
      {flightPath.length>1 && <Polyline positions={flightPath} pathOptions={{color:'#2563eb',weight:3,dashArray:'9 7',opacity:.85}}/>}
    </MapContainer>
  </div>;
}
