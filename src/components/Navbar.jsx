import { Bell, LogOut, Sparkles } from 'lucide-react';

const Navbar = ({ role, onLogout }) => {
  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="glass-panel flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-steel">AI Logistics Workspace</p>
        <h1 className="mt-2 font-display text-3xl font-bold">
          LogiAI {role === 'manager' ? 'Command Center' : 'Shipment Desk'}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white">
          <Sparkles size={16} />
          Simulated AI Insights Active
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
          <Bell size={16} />
          {today}
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 rounded-2xl bg-ember px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
