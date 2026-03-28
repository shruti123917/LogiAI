import { Activity, FileCheck2, PackagePlus, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';
import Chatbot from '../components/Chatbot';
import RouteOptimizationPanel from '../components/RouteOptimizationPanel';
import ShipmentCard from '../components/ShipmentCard';

const initialForm = {
  source: '',
  destination: '',
  type: 'General',
  date: '',
};

const EmployeeDashboard = ({ shipments, activeSection, onAddShipment }) => {
  const [form, setForm] = useState(initialForm);
  const [uploadResult, setUploadResult] = useState('Document Verified');
  const [selectedShipmentId, setSelectedShipmentId] = useState(shipments[0]?.id ?? null);

  const metrics = useMemo(
    () => [
      { label: 'Total Shipments', value: shipments.length, icon: Truck },
      { label: 'Pending Actions', value: shipments.filter((item) => item.status === 'Pending').length, icon: Activity },
      { label: 'High Risk', value: shipments.filter((item) => item.risk === 'High').length, icon: FileCheck2 },
    ],
    [shipments],
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddShipment(form);
    setForm(initialForm);
  };

  const renderDashboard = () => (
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

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-panel p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-slate-950 p-3 text-white">
              <PackagePlus size={18} />
            </div>
            <div>
              <h2 className="section-title">Add Shipment</h2>
              <p className="text-sm text-steel">Create a new shipment request with AI-assisted risk simulation.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              required
              value={form.source}
              onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value }))}
              placeholder="Source"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            />
            <input
              required
              value={form.destination}
              onChange={(event) => setForm((prev) => ({ ...prev, destination: event.target.value }))}
              placeholder="Destination"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            />
            <select
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              <option>General</option>
              <option>Electronics</option>
              <option>Retail</option>
              <option>Medical</option>
              <option>Perishable</option>
            </select>
            <input
              required
              type="date"
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            />
            <button
              type="submit"
              className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 md:col-span-2"
            >
              Submit Shipment
            </button>
          </form>
        </div>

        <div className="glass-panel p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-accent p-3 text-white">
              <FileCheck2 size={18} />
            </div>
            <div>
              <h2 className="section-title">Document Upload</h2>
              <p className="text-sm text-steel">Drop files for instant mock verification.</p>
            </div>
          </div>

          <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-slate-950 hover:bg-white">
            <input
              type="file"
              className="hidden"
              onChange={() => {
                setUploadResult(Math.random() > 0.45 ? 'Document Verified' : 'Missing Fields Detected');
              }}
            />
            <p className="font-display text-2xl font-bold">Drag and drop documents here</p>
            <p className="mt-2 text-sm text-slate-500">or click to upload invoice, proof of dispatch, or manifest</p>
          </label>

          <div className="mt-4 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
            Validation Result: {uploadResult}
          </div>
        </div>
      </section>

      <RouteOptimizationPanel
        shipments={shipments}
        title="Live Route Optimization"
        description="Analyze shortest, fastest, and fuel-efficient corridors for the selected shipment."
        selectedShipmentId={selectedShipmentId}
        onSelectedShipmentChange={setSelectedShipmentId}
      />
    </div>
  );

  if (activeSection === 'Shipments') {
    return (
      <div className="space-y-6">
        <RouteOptimizationPanel
          shipments={shipments}
          title="Shipment Tracking + Route Optimization"
          description="Select a shipment to update the live map, compare route options, and inspect footprint savings."
          selectedShipmentId={selectedShipmentId}
          onSelectedShipmentChange={setSelectedShipmentId}
        />

        <div>
          <h2 className="section-title">Shipment Tracking</h2>
          <p className="mt-2 text-sm text-steel">Track status, AI risk scoring, delivery predictions, and optimized routing.</p>
        </div>
        {shipments.map((shipment) => (
          <ShipmentCard
            key={shipment.id}
            shipment={shipment}
            selected={shipment.id === selectedShipmentId}
            onClick={() => setSelectedShipmentId(shipment.id)}
          />
        ))}
      </div>
    );
  }

  if (activeSection === 'Chatbot') {
    return <Chatbot shipments={shipments} />;
  }

  return renderDashboard();
};

export default EmployeeDashboard;
