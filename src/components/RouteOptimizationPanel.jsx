import { Leaf, Route, TimerReset, Truck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getShipmentRouteInsights } from '../data/routeData';
import RouteMap from './RouteMap';

const metricCards = (selectedRoute) => [
  {
    label: 'Fuel Saved',
    value: `${selectedRoute.fuelSavedPercent}%`,
    note: 'versus baseline route',
    icon: Leaf,
    tone: 'bg-emerald-50 text-emerald-700',
  },
  {
    label: 'CO2 Reduced',
    value: `${selectedRoute.co2Reduced} kg`,
    note: 'simulated emission reduction',
    icon: Route,
    tone: 'bg-sky-50 text-sky-700',
  },
  {
    label: 'Eco Score',
    value: `${selectedRoute.ecoScore}/100`,
    note: 'sustainability index',
    icon: TimerReset,
    tone: 'bg-amber-50 text-amber-700',
  },
];

const RouteOptimizationPanel = ({
  shipments,
  title = 'Route Optimization',
  description,
  selectedShipmentId: controlledSelectedShipmentId,
  onSelectedShipmentChange,
}) => {
  const [internalSelectedShipmentId, setInternalSelectedShipmentId] = useState(shipments[0]?.id ?? null);
  const [selectedRouteId, setSelectedRouteId] = useState('eco');

  const selectedShipmentId = controlledSelectedShipmentId ?? internalSelectedShipmentId;
  const setSelectedShipmentId = onSelectedShipmentChange ?? setInternalSelectedShipmentId;

  useEffect(() => {
    if (!shipments.some((shipment) => shipment.id === selectedShipmentId)) {
      setSelectedShipmentId(shipments[0]?.id ?? null);
    }
  }, [shipments, selectedShipmentId, setSelectedShipmentId]);

  const selectedShipment = useMemo(
    () => shipments.find((shipment) => shipment.id === selectedShipmentId) || shipments[0],
    [shipments, selectedShipmentId],
  );

  const routeInsights = useMemo(
    () => getShipmentRouteInsights(selectedShipment),
    [selectedShipment],
  );

  useEffect(() => {
    if (routeInsights?.bestRouteId) {
      setSelectedRouteId(routeInsights.bestRouteId);
    }
  }, [routeInsights?.bestRouteId]);

  const selectedRoute = routeInsights?.routes.find((route) => route.id === selectedRouteId) || routeInsights?.routes[0];

  if (!selectedShipment || !routeInsights || !selectedRoute) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="section-title">{title}</h2>
          <p className="mt-2 text-sm text-steel">
            {description || 'Dynamic route intelligence with fuel, time, and emissions trade-off analysis.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {shipments.map((shipment) => (
            <button
              key={shipment.id}
              type="button"
              onClick={() => setSelectedShipmentId(shipment.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedShipment.id === shipment.id
                  ? 'bg-slate-950 text-white shadow-lg'
                  : 'bg-white/70 text-slate-600 hover:bg-white'
              }`}
            >
              {shipment.id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <RouteMap
          shipment={selectedShipment}
          routeInsights={routeInsights}
          selectedRouteId={selectedRouteId}
          onSelectRoute={setSelectedRouteId}
        />

        <div className="space-y-5">
          <div className="glass-panel p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-steel">Selected Shipment</p>
                <h3 className="mt-2 font-display text-2xl font-bold">
                  {selectedShipment.source} to {selectedShipment.destination}
                </h3>
              </div>
              <div className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                {selectedShipment.status}
              </div>
            </div>

            <div className="space-y-3">
              {routeInsights.routes.map((route) => {
                const isSelected = route.id === selectedRoute.id;
                const isBest = route.id === routeInsights.bestRouteId;

                return (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`w-full rounded-[26px] border p-4 text-left transition ${
                      isSelected ? 'border-slate-950 bg-slate-950 text-white shadow-lg' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-xl font-bold">{route.name}</span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isBest ? route.badge : 'Alternate Route'}
                          </span>
                        </div>
                        <p className={`mt-2 text-sm ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                          Distance {route.distance} km, Time {route.time} hrs, Fuel {route.fuel} L
                        </p>
                      </div>
                      <div
                        className="h-4 w-16 rounded-full"
                        style={{ backgroundColor: route.color, boxShadow: isSelected ? `0 0 0 3px ${route.color}33` : 'none' }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            {metricCards(selectedRoute).map(({ label, value, note, icon: Icon, tone }) => (
              <div key={label} className={`rounded-[26px] p-4 ${tone}`}>
                <div className="mb-3 inline-flex rounded-2xl bg-white/80 p-3">
                  <Icon size={18} />
                </div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="mt-2 font-display text-3xl font-bold">{value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] opacity-80">{note}</p>
              </div>
            ))}
          </div>

          <div className="glass-panel h-[320px] p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-slate-950 p-3 text-white">
                <Truck size={18} />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Route Comparison</h3>
                <p className="text-sm text-steel">Distance, travel time, and fuel consumption side by side.</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeInsights.comparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="distance" fill="#2563eb" radius={[8, 8, 0, 0]} />
                <Bar dataKey="time" fill="#f97316" radius={[8, 8, 0, 0]} />
                <Bar dataKey="fuel" fill="#0f9d8f" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RouteOptimizationPanel;
