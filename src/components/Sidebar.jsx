import { Bot, ChartNoAxesCombined, LayoutDashboard, PackageSearch, ShieldCheck } from 'lucide-react';

const iconMap = {
  Dashboard: LayoutDashboard,
  Shipments: PackageSearch,
  Chatbot: Bot,
  Analytics: ChartNoAxesCombined,
};

const Sidebar = ({ role, activeSection, onSectionChange }) => {
  const items = ['Dashboard', 'Shipments', 'Chatbot', ...(role === 'manager' ? ['Analytics'] : [])];

  return (
    <aside className="glass-panel h-fit p-5">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-slate-950 p-3 text-white">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="font-display text-xl font-bold">LogiAI</p>
          <p className="text-sm text-steel">{role === 'manager' ? 'Manager Access' : 'Employee Access'}</p>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = iconMap[item];
          const isActive = activeSection === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => onSectionChange(item)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                isActive
                  ? 'bg-slate-950 text-white shadow-lg'
                  : 'bg-white/50 text-slate-600 hover:bg-white hover:text-slate-950'
              }`}
            >
              <Icon size={18} />
              {item}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
