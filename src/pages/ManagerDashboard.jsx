import {
  AlertTriangle,
  CircleGauge,
  Clock3,
  PackageCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import Chatbot from '../components/Chatbot';
import RouteOptimizationPanel from '../components/RouteOptimizationPanel';
import ShipmentCard from '../components/ShipmentCard';

const pieColors = ['#0f9d8f', '#f59e0b', '#ef4444'];

const ManagerDashboard = ({ shipments, activeSection, onUpdateShipmentStatus }) => {
  const [selectedShipmentId, setSelectedShipmentId] = useState(shipments[0]?.id ?? null);

  const metrics = useMemo(
    () => [
      { label: 'Total Shipments', value: shipments.length, icon: PackageCheck },
      { label: 'High Risk Cases', value: shipments.filter((item) => item.risk === 'High').length, icon: AlertTriangle },
      { label: 'Delay Alerts', value: shipments.filter((item) => item.delayPrediction !== 'On-time delivery expected.').length, icon: Clock3 },
    ],
    [shipments],
  );

  const riskDistribution = useMemo(() => {
    const levels = ['Low', 'Medium', 'High'];
    return levels.map((level) => ({
      name: level,
      value: shipments.filter((item) => item.risk === level).length,
    }));
  }, [shipments]);

  const delayStats = useMemo(
    () => [
      { name: 'On Time', value: shipments.filter((item) => item.delayPrediction === 'On-time delivery expected.').length },
      { name: 'Watchlist', value: shipments.filter((item) => item.delayPrediction.includes('Minor')).length },
      { name: 'Delayed', value: shipments.filter((item) => item.delayPrediction.includes('High delay')).length },
    ],
    [shipments],
  );

  const alerts = useMemo(() => {
    const values = [];

    if (shipments.some((item) => item.risk === 'High')) {
      values.push('High risk shipment detected');
    }

    if (shipments.some((item) => item.delayPrediction !== 'On-time delivery expected.')) {
      values.push('Delay predicted');
    }

    if (shipments.some((item) => item.fraudAlert !== 'No fraud indicators detected.')) {
      values.push('Fraud alert triggered by AI checks');
    }

    return values;
  }, [shipments]);

  const renderOverview = () => (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="metric-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-steel">{label}</p>
              <div className="rounded-2xl bg-slate-950 p-3 text-white">
                <Icon size={18} />
              </div>
            </div>
            <p className="mt-5 font-display text-4xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-slate-950 p-3 text-white">
              <CircleGauge size={18} />
            </div>
            <div>
              <h2 className="section-title">Shipment Review Panel</h2>
              <p className="text-sm text-steel">Review risk scores, documents, update decisions, and pick a shipment for route analysis.</p>
            </div>
          </div>

          <div className="space-y-4">
            {shipments.map((shipment) => (
              <ShipmentCard
                key={shipment.id}
                shipment={shipment}
                selected={shipment.id === selectedShipmentId}
                onClick={() => setSelectedShipmentId(shipment.id)}
                actions={
                  <>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onUpdateShipmentStatus(shipment.id, 'Approved');
                      }}
                      className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onUpdateShipmentStatus(shipment.id, 'Rejected');
                      }}
                      className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Reject
                    </button>
                  </>
                }
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-amber-500 p-3 text-white">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h2 className="section-title">Alerts</h2>
                <p className="text-sm text-steel">AI-generated attention items for operations leadership.</p>
              </div>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert} className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
                  {alert}
                </div>
              ))}
            </div>
          </div>

          <RouteOptimizationPanel
            shipments={shipments}
            title="Sustainability Command View"
            description="Monitor best-route recommendations, carbon savings, and live route comparisons for each shipment."
            selectedShipmentId={selectedShipmentId}
            onSelectedShipmentChange={setSelectedShipmentId}
          />
        </div>
      </section>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Analytics Dashboard</h2>
        <p className="mt-2 text-sm text-steel">Visualize shipment volume, risk distribution, and delay patterns.</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="glass-panel h-[360px] p-5">
          <h3 className="mb-4 font-display text-xl font-bold">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110}>
                {riskDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel h-[360px] p-5">
          <h3 className="mb-4 font-display text-xl font-bold">Delay Stats</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={delayStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );

  if (activeSection === 'Shipments') {
    return (
      <div className="space-y-6">
        <RouteOptimizationPanel
          shipments={shipments}
          title="Shipment Review + Route Optimization"
          description="Select a shipment to drive the live map, best-route highlight, and sustainability analysis."
          selectedShipmentId={selectedShipmentId}
          onSelectedShipmentChange={setSelectedShipmentId}
        />

        <div>
          <h2 className="section-title">Shipment Review</h2>
          <p className="mt-2 text-sm text-steel">Approve or reject requests based on risk, document health, and optimized routing insights.</p>
        </div>
        {shipments.map((shipment) => (
          <ShipmentCard
            key={shipment.id}
            shipment={shipment}
            selected={shipment.id === selectedShipmentId}
            onClick={() => setSelectedShipmentId(shipment.id)}
            actions={
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onUpdateShipmentStatus(shipment.id, 'Approved');
                  }}
                  className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onUpdateShipmentStatus(shipment.id, 'Rejected');
                  }}
                  className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Reject
                </button>
              </>
            }
          />
        ))}
      </div>
    );
  }

  if (activeSection === 'Chatbot') {
    return <Chatbot shipments={shipments} />;
  }

  if (activeSection === 'Analytics') {
    return renderAnalytics();
  }

  return renderOverview();
};

export default ManagerDashboard;
