import { ArrowRight, BriefcaseBusiness, Truck } from 'lucide-react';
import { roleProfiles } from '../data/mockData';

const roleCards = [
  { key: 'employee', label: 'Employee', icon: Truck },
  { key: 'manager', label: 'Manager', icon: BriefcaseBusiness },
];

const Login = ({ onLogin }) => (
  <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-8">
        <div className="inline-flex items-center rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur">
          AI-powered logistics coordination for modern fleets
        </div>

        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-signal">Hackathon Prototype</p>
          <h1 className="font-display text-5xl font-bold leading-tight text-ink sm:text-6xl">
            Smarter shipment workflows with simulated AI insights.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            LogiAI helps teams create shipments, validate documents, review risks, and monitor delays through a crisp,
            presentation-ready operations dashboard.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="metric-card">
            <p className="text-sm font-semibold text-steel">Risk Engine</p>
            <h3 className="mt-2 font-display text-3xl font-bold">92%</h3>
            <p className="mt-2 text-sm text-slate-500">AI-generated confidence for route scoring.</p>
          </div>
          <div className="metric-card">
            <p className="text-sm font-semibold text-steel">Live Visibility</p>
            <h3 className="mt-2 font-display text-3xl font-bold">24/7</h3>
            <p className="mt-2 text-sm text-slate-500">Track approvals, transit, and delays instantly.</p>
          </div>
          <div className="metric-card">
            <p className="text-sm font-semibold text-steel">Ops Speed</p>
            <h3 className="mt-2 font-display text-3xl font-bold">3x</h3>
            <p className="mt-2 text-sm text-slate-500">Faster review cycles for demo-ready workflows.</p>
          </div>
        </div>
      </section>

      <section className="glass-panel p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-500">Secure Access</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Choose your role</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Login is simulated locally for this prototype. Select a role to enter the matching dashboard.
          </p>
        </div>

        <div className="space-y-4">
          {roleCards.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => onLogin(key)}
              className="group w-full rounded-3xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:border-slate-950 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-4 inline-flex rounded-2xl bg-slate-950 p-3 text-white">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display text-2xl font-bold">{label}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">{roleProfiles[key].subtitle}</p>
                </div>
                <ArrowRight className="transition group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  </div>
);

export default Login;
