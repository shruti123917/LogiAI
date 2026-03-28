import Map, { Layer, Marker, NavigationControl, Source } from 'react-map-gl/mapbox';
import { MapPin, Route } from 'lucide-react';

const mapStyle = 'mapbox://styles/mapbox/light-v11';

const lineLayer = (color, width, opacity) => ({
  id: `route-${color.replace('#', '')}-${width}`,
  type: 'line',
  paint: {
    'line-color': color,
    'line-width': width,
    'line-opacity': opacity,
  },
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
});

const RouteMap = ({ shipment, routeInsights, selectedRouteId, onSelectRoute }) => {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;

  if (!shipment || !routeInsights) {
    return (
      <div className="glass-panel flex min-h-[420px] items-center justify-center p-6">
        <p className="text-sm font-semibold text-steel">Select a shipment to visualize optimized routes.</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="glass-panel flex min-h-[420px] flex-col justify-between overflow-hidden p-6">
        <div>
          <div className="mb-4 inline-flex rounded-2xl bg-slate-950 p-3 text-white">
            <Route size={20} />
          </div>
          <h3 className="font-display text-2xl font-bold">Mapbox token required</h3>
          <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">
            Add <code className="rounded bg-slate-100 px-2 py-1">VITE_MAPBOX_TOKEN</code> to a local <code className="rounded bg-slate-100 px-2 py-1">.env</code>
            file to render the live route map. Route intelligence and sustainability metrics are ready below.
          </p>
        </div>

        <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,#dbeafe_0%,#eef2ff_50%,#dcfce7_100%)] p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white px-3 py-2 text-sm font-semibold shadow">{shipment.source}</span>
            <span className="text-sm font-semibold text-slate-500">to</span>
            <span className="rounded-full bg-white px-3 py-2 text-sm font-semibold shadow">{shipment.destination}</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {routeInsights.routes.map((route) => (
              <button
                key={route.id}
                type="button"
                onClick={() => onSelectRoute(route.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition ${
                  selectedRouteId === route.id ? 'scale-105 shadow-lg' : 'opacity-85'
                }`}
                style={{ backgroundColor: route.color }}
              >
                {route.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const selectedRoute = routeInsights.routes.find((route) => route.id === selectedRouteId) || routeInsights.routes[0];

  return (
    <div className="glass-panel overflow-hidden p-2">
      <Map
        key={shipment.id}
        initialViewState={{
          longitude: (routeInsights.sourceCoords[0] + routeInsights.destinationCoords[0]) / 2,
          latitude: (routeInsights.sourceCoords[1] + routeInsights.destinationCoords[1]) / 2,
          zoom: 4.5,
        }}
        mapStyle={mapStyle}
        mapboxAccessToken={token}
        style={{ width: '100%', minHeight: 460, borderRadius: 28 }}
      >
        <NavigationControl position="top-right" />

        {routeInsights.routes.map((route) => {
          const isSelected = route.id === selectedRoute.id;

          return (
            <Source key={route.id} id={route.id} type="geojson" data={{ type: 'Feature', geometry: route.geometry }}>
              <Layer {...lineLayer(route.color, isSelected ? 7 : 4, isSelected ? 0.96 : 0.5)} />
            </Source>
          );
        })}

        <Marker longitude={routeInsights.sourceCoords[0]} latitude={routeInsights.sourceCoords[1]} anchor="bottom">
          <div className="rounded-full bg-slate-950 p-2 text-white shadow-lg">
            <MapPin size={18} />
          </div>
        </Marker>

        <Marker longitude={routeInsights.destinationCoords[0]} latitude={routeInsights.destinationCoords[1]} anchor="bottom">
          <div className="rounded-full bg-accent p-2 text-white shadow-lg">
            <MapPin size={18} />
          </div>
        </Marker>
      </Map>
    </div>
  );
};

export default RouteMap;
