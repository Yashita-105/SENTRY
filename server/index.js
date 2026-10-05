import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const HQ = { lat: 32.2396, lng: 77.1887 };

let nodes = [
  {id:'N01',meshId:'MESH-01',meshName:'North Ridge Mesh',name:'North Ridge Relay',lat:32.3580,lng:77.2215,elevation:'3,320 m',temp:-2.4,humidity:82,pressure:684.5,waterLevel:1.1,windSpeed:42.5,battery:94,rssi:-72,status:'WARNING',hazard:'Seismic movement detected',pir:'TRIGGER',seismic:'HIGH',thermal:'ELEVATED',lidar:'ACTIVE',meshNeighbors:['N02','N03']},
  {id:'N02',meshId:'MESH-01',meshName:'North Ridge Mesh',name:'Upper Ridge Post',lat:32.3640,lng:77.1980,elevation:'3,410 m',temp:-1.2,humidity:79,pressure:677.2,waterLevel:.8,windSpeed:31.2,battery:91,rssi:-66,status:'NORMAL',hazard:'Perimeter monitoring active',pir:'CLEAR',seismic:'LOW',thermal:'NORMAL',lidar:'ACTIVE',meshNeighbors:['N01','N04']},
  {id:'N03',meshId:'MESH-01',meshName:'North Ridge Mesh',name:'Ridge Saddle',lat:32.3385,lng:77.1570,elevation:'3,060 m',temp:1.8,humidity:75,pressure:701.4,waterLevel:1.6,windSpeed:28.1,battery:87,rssi:-79,status:'NORMAL',hazard:'Perimeter monitoring active',pir:'CLEAR',seismic:'LOW',thermal:'NORMAL',lidar:'ACTIVE',meshNeighbors:['N01','N04']},
  {id:'N04',meshId:'MESH-01',meshName:'North Ridge Mesh',name:'Northern Chokepoint',lat:32.3160,lng:77.1775,elevation:'2,820 m',temp:3.8,humidity:76,pressure:725.1,waterLevel:2.4,windSpeed:26.4,battery:83,rssi:-74,status:'WARNING',hazard:'Abnormal vibration signature',pir:'TRIGGER',seismic:'HIGH',thermal:'ELEVATED',lidar:'ACTIVE',meshNeighbors:['N02','N03']},
  {id:'N05',meshId:'MESH-02',meshName:'Central Corridor Mesh',name:'Central Sector East',lat:32.2535,lng:77.1842,elevation:'2,040 m',temp:14.2,humidity:94,pressure:795.0,waterLevel:5.2,windSpeed:22.4,battery:86,rssi:-64,status:'CRITICAL',hazard:'Multiple movement signatures detected',pir:'TRIGGER',seismic:'HIGH',thermal:'DETECTED',lidar:'ACTIVE',meshNeighbors:['N06','N07']},
  {id:'N06',meshId:'MESH-02',meshName:'Central Corridor Mesh',name:'Central Sector West',lat:32.2680,lng:77.1640,elevation:'2,110 m',temp:12.4,humidity:91,pressure:787.5,waterLevel:3.7,windSpeed:19.8,battery:89,rssi:-61,status:'WARNING',hazard:'Unusual activity detected in sector',pir:'CLEAR',seismic:'MEDIUM',thermal:'NORMAL',lidar:'ACTIVE',meshNeighbors:['N05','N08']},
  {id:'N07',meshId:'MESH-02',meshName:'Central Corridor Mesh',name:'Central Checkpoint',lat:32.2390,lng:77.1575,elevation:'1,980 m',temp:16.5,humidity:87,pressure:802.2,waterLevel:2.2,windSpeed:17.4,battery:95,rssi:-58,status:'NORMAL',hazard:'Perimeter monitoring active',pir:'CLEAR',seismic:'LOW',thermal:'NORMAL',lidar:'ACTIVE',meshNeighbors:['N05','N08']},
  {id:'N08',meshId:'MESH-02',meshName:'Central Corridor Mesh',name:'Forest Approach',lat:32.2250,lng:77.1760,elevation:'1,920 m',temp:17.1,humidity:83,pressure:807.0,waterLevel:1.8,windSpeed:15.6,battery:90,rssi:-69,status:'NORMAL',hazard:'Perimeter monitoring active',pir:'CLEAR',seismic:'LOW',thermal:'NORMAL',lidar:'ACTIVE',meshNeighbors:['N06','N07']},
  {id:'N09',meshId:'MESH-03',meshName:'Valley Approach Mesh',name:'Valley Gate East',lat:32.2140,lng:77.1930,elevation:'1,980 m',temp:17.5,humidity:58,pressure:804.1,waterLevel:1.4,windSpeed:12,battery:91,rssi:-58,status:'NORMAL',hazard:'Perimeter monitoring active',pir:'CLEAR',seismic:'LOW',thermal:'NORMAL',lidar:'ACTIVE',meshNeighbors:['N10','N11']},
  {id:'N10',meshId:'MESH-03',meshName:'Valley Approach Mesh',name:'Valley Gate West',lat:32.2025,lng:77.1680,elevation:'1,910 m',temp:18.2,humidity:62,pressure:809.3,waterLevel:1.1,windSpeed:13.8,battery:88,rssi:-63,status:'NORMAL',hazard:'Perimeter monitoring active',pir:'CLEAR',seismic:'LOW',thermal:'NORMAL',lidar:'ACTIVE',meshNeighbors:['N09','N12']},
  {id:'N11',meshId:'MESH-03',meshName:'Valley Approach Mesh',name:'Highway Observation',lat:32.1880,lng:77.2050,elevation:'1,860 m',temp:19.1,humidity:60,pressure:815.4,waterLevel:1.2,windSpeed:18.2,battery:96,rssi:-55,status:'WARNING',hazard:'PIR movement detected',pir:'TRIGGER',seismic:'LOW',thermal:'ELEVATED',lidar:'ACTIVE',meshNeighbors:['N09','N12']},
  {id:'N12',meshId:'MESH-03',meshName:'Valley Approach Mesh',name:'Southern Relay',lat:32.1765,lng:77.1820,elevation:'1,820 m',temp:19.8,humidity:57,pressure:818.1,waterLevel:.9,windSpeed:11.4,battery:93,rssi:-62,status:'NORMAL',hazard:'Perimeter monitoring active',pir:'CLEAR',seismic:'LOW',thermal:'NORMAL',lidar:'ACTIVE',meshNeighbors:['N10','N11']}
];

let drone = {
  id: 'SENTRY-DRONE-01',
  model: 'SENTRY Autonomous VTOL',
  trackingEnabled: true,
  status: 'STANDBY',
  lat: HQ.lat,
  lng: HQ.lng,
  targetNodeId: null,
  targetLat: null,
  targetLng: null,
  altitude: 0,
  speed: 0,
  heading: 45,
  battery: 88
};

const clients = [];
let droneMissionLogCounter = 0;

function broadcast(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach(client => client.res.write(payload));
}

app.get('/api/health', (_req, res) => res.json({ status: 'OK', system: 'SENTRY Gateway', timestamp: new Date().toISOString() }));
app.get('/api/nodes', (_req, res) => res.json({ success: true, nodes }));
app.get('/api/drone', (_req, res) => res.json({ success: true, drone }));

app.get('/api/mesh', (_req, res) => res.json({
  gateway: 'GATEWAY',
  nodes: nodes.map(n => ({ id: n.id, neighbors: n.meshNeighbors || [] })),
  principle: 'Private LoRa node-to-node alerts with gateway-only external uplink'
}));

app.post('/api/nodes/telemetry', (req, res) => {
  const { nodeId } = req.body;
  if (!nodeId) return res.status(400).json({ success: false, error: 'nodeId is required' });

  const index = nodes.findIndex(n => n.id === nodeId);
  const old = index >= 0 ? nodes[index] : {};
  const temp = req.body.temp !== undefined ? Number(req.body.temp) : old.temp ?? 25;
  const waterLevel = req.body.waterLevel !== undefined ? Number(req.body.waterLevel) : old.waterLevel ?? 0;
  const windSpeed = req.body.windSpeed !== undefined ? Number(req.body.windSpeed) : old.windSpeed ?? 0;

  const status = req.body.status || (
    waterLevel > 4 || temp > 40 || windSpeed > 35 ? 'CRITICAL' :
    waterLevel > 3 || temp > 35 || windSpeed > 25 || temp < 0 ? 'WARNING' : 'NORMAL'
  );

  const updated = {
    ...old,
    ...req.body,
    id: nodeId,
    lat: req.body.lat !== undefined ? Number(req.body.lat) : old.lat,
    lng: req.body.lng !== undefined ? Number(req.body.lng) : old.lng,
    temp, waterLevel, windSpeed, status,
    lastSeen: new Date().toISOString()
  };

  if (index >= 0) nodes[index] = updated;
  else nodes.push(updated);

  broadcast({ type: 'NODE_TELEMETRY', node: updated });
  res.json({ success: true, node: updated });
});

app.post('/api/drone/dispatch', (req, res) => {
  const node = nodes.find(n => n.id === req.body.nodeId);
  if (!node) return res.status(404).json({ success: false, error: 'Target node not found' });

  drone = {
    ...drone,
    status: 'DISPATCHED',
    targetNodeId: node.id,
    targetLat: node.lat,
    targetLng: node.lng,
    altitude: 45,
    speed: 12.5
  };

  broadcast({ type: 'DRONE_DISPATCHED', drone, targetName: node.name });
  broadcast({ type: 'DRONE_LOG', log: { source:'UAV COMMAND', message:`Drone launched for ${node.id} — ${node.name}.`, type:'DRONE', level:'NORMAL', nodeId:node.id, timestamp:new Date().toLocaleTimeString() } });
  res.json({ success: true, message: `Drone dispatched to ${node.id}`, drone });
});

app.post('/api/drone/command', (req, res) => {
  const command = req.body.command;
  if (command === 'RTL') {
    drone = { ...drone, status: 'RETURNING', targetNodeId: null, targetLat: HQ.lat, targetLng: HQ.lng, altitude: 45, speed: 15 };
  } else if (command === 'HOVER') {
    drone = { ...drone, status: 'HOVERING', speed: 0 };
  }
  broadcast({ type: 'DRONE_COMMAND', drone });
  res.json({ success: true, drone });
});

app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const client = { id: Date.now() + Math.random(), res };
  clients.push(client);
  res.write(`data: ${JSON.stringify({ type: 'INITIAL_STATE', nodes, drone })}\n\n`);

  req.on('close', () => {
    const i = clients.indexOf(client);
    if (i >= 0) clients.splice(i, 1);
  });
});

// Server-side drone movement makes LIVE SERVER mode actually move the UAV on the map.
setInterval(() => {
  if (!['DISPATCHED', 'RETURNING'].includes(drone.status) || drone.targetLat === null) return;

  const dLat = drone.targetLat - drone.lat;
  const dLng = drone.targetLng - drone.lng;
  const distance = Math.hypot(dLat, dLng);
  const heading = (Math.atan2(dLng, dLat) * 180 / Math.PI + 360) % 360;

  if (distance < 0.00035) {
    const returning = drone.status === 'RETURNING';
    drone = {
      ...drone,
      lat: drone.targetLat,
      lng: drone.targetLng,
      status: returning ? 'STANDBY' : 'HOVERING',
      speed: 0,
      altitude: returning ? 0 : 45,
      heading: Math.round(heading),
      targetNodeId: returning ? null : drone.targetNodeId
    };
    broadcast({ type: 'DRONE_ARRIVED', drone });
    return;
  }

  drone = {
    ...drone,
    lat: drone.lat + dLat * 0.045,
    lng: drone.lng + dLng * 0.045,
    heading: Math.round(heading),
    speed: drone.status === 'RETURNING' ? 15 : 12.5,
    altitude: 45
  };
  broadcast({ type: 'DRONE_TELEMETRY', drone });
}, 500);


// Demo mission event stream. Replace these events with the actual edge-AI classifier feed when the UAV payload is connected.
setInterval(() => {
  if (!['DISPATCHED', 'HOVERING'].includes(drone.status) || !drone.targetNodeId) return;
  const target = nodes.find(n => n.id === drone.targetNodeId);
  if (!target) return;
  const events = [
    ['AIRBORNE', 'UAV observation pass active over assigned sector.', 'DRONE', 'NORMAL'],
    ['EO/IR ANALYTICS', 'Person-sized movement detected; track established.', 'DETECTION', 'WARNING'],
    ['EO/IR ANALYTICS', 'Vehicle signature detected; classification pending.', 'DETECTION', 'WARNING'],
    ['CLASSIFIER', 'Tracked / armoured-vehicle-class signature detected; confidence 81%.', 'DETECTION', 'CRITICAL'],
    ['CLASSIFIER', 'No additional movement detected in the immediate observation area.', 'DETECTION', 'NORMAL']
  ];
  const event = events[droneMissionLogCounter % events.length];
  droneMissionLogCounter += 1;
  broadcast({ type:'DRONE_LOG', log:{ source:event[0], message:`${event[1]} [${target.id}]`, type:event[2], level:event[3], nodeId:target.id, timestamp:new Date().toLocaleTimeString() } });
}, 3000);

app.listen(PORT, () => console.log(`SENTRY Gateway Server running on http://localhost:${PORT}`));
