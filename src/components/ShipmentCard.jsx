import { AlertTriangle, ArrowRight, CircleAlert, ShieldCheck } from 'lucide-react';

const riskTone = {
  Low: 'bg-emerald-50 text-emerald-700',
  Medium: 'bg-amber-50 text-amber-700',
  High: 'bg-rose-50 text-rose-700',
};

const statusTone = {
  Pending: 'bg-slate-100 text-slate-700',
  Approved: 'bg-sky-50 text-sky-700',
  Rejected: 'bg-rose-50 text-rose-700',
  'In Transit': 'bg-violet-50 text-violet-700',
  Delivered: 'bg-emerald-50 text-emerald-700',
};

const ShipmentCard = ({ shipment, actions, onClick, selected = false }) => (
  <article
    className={`glass-panel p-5 transition ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''} ${
      selected ? 'ring-2 ring-slate-950 ring-offset-2 ring-offset-transparent' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display text-xl font-bold">{shipment.id}</h3>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusTone[shipment.status]}`}>
            {shipment.status}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${riskTone[shipment.risk]}`}>
            {shipment.risk} Risk
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <span>{shipment.source}</span>
          <ArrowRight size={16} />
          <span>{shipment.destination}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{shipment.type}</span>
          <span>{shipment.date}</span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              <ShieldCheck size={14} />
              Document Status
            </p>
            <p className="text-sm font-semibold text-slate-700">{shipment.documentStatus}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              <CircleAlert size={14} />
              Delay Prediction
            </p>
            <p className="text-sm font-semibold text-slate-700">{shipment.delayPrediction}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3 md:col-span-2">
            <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              <AlertTriangle size={14} />
              Fraud Alert
            </p>
            <p className="text-sm font-semibold text-slate-700">{shipment.fraudAlert}</p>
          </div>
        </div>
      </div>

      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  </article>
);

export default ShipmentCard;
