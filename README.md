# SENTRY Command Center

Professional multi-page field operations dashboard for the autonomous border surveillance prototype.

## Structure

- `client/` — React + Vite command interface
- `server/` — Express gateway and real-time telemetry stream

## Command flow

1. Overview shows every mesh and every field node.
2. Open a mesh to inspect its complete node inventory and topology.
3. Open a node to review live telemetry and sensor state.
4. Dispatch the UAV to the selected node GPS coordinate.
5. Track UAV position in real time on the map.
6. Review mission detection events in the UAV mission log and Alerts page.

## Map

The default map uses the Esri World Street Map tile service, with MapTiler available through `VITE_MAPTILER_KEY`. The map supports world-scale zoom without switching to a custom local background.

## Run

### Gateway

```powershell
cd server
npm install
npm run dev
```

### Client

```powershell
cd client
npm install
npm run dev
```

The client defaults to demo simulation mode. Disable Demo simulation from System to connect to the Express gateway at `http://localhost:5000`.

## Mission detection events

The included demo stream generates representative UAV analytics events such as person-sized movement, vehicle signatures and armoured-vehicle-class signatures. These are clearly demo/simulated events and are intended to be replaced by the actual edge-AI classifier feed when integrated with the UAV payload.
