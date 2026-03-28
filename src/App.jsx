import { useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { initialShipments } from './data/mockData';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';

const statuses = ['Pending', 'Approved', 'In Transit', 'Delivered'];
const risks = ['Low', 'Medium', 'High'];

const toTitleCase = (value) =>
  value
    .toLowerCase()
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const buildShipment = (form) => {
  const source = form.source.trim();
  const destination = form.destination.trim();
  const randomRisk = risks[(source.length + destination.length + form.type.length) % risks.length];
  const randomStatus = statuses[(source.length + destination.length) % statuses.length];
  const documentStatus = source[0]?.toLowerCase() === destination[0]?.toLowerCase()
    ? 'Missing Fields Detected'
    : 'Document Verified';

  const delayPrediction =
    randomRisk === 'High'
      ? 'High delay probability due to route congestion.'
      : randomRisk === 'Medium'
        ? 'Minor weather slowdown predicted near transit hub.'
        : 'On-time delivery expected.';

  const fraudAlert =
    randomRisk === 'High'
      ? 'High risk shipment detected: unusual routing pattern flagged.'
      : 'No fraud indicators detected.';

  return {
    id: `SHP-${Math.floor(1000 + Math.random() * 9000)}`,
    source: toTitleCase(source),
    destination: toTitleCase(destination),
    type: form.type,
    date: form.date,
    status: randomStatus,
    risk: randomRisk,
    documentStatus,
    delayPrediction,
    fraudAlert,
  };
};

const App = () => {
  const [role, setRole] = useState(null);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [shipments, setShipments] = useState(initialShipments);

  const sortedShipments = useMemo(() => [...shipments].reverse(), [shipments]);

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setActiveSection('Dashboard');
  };

  const handleLogout = () => {
    setRole(null);
    setActiveSection('Dashboard');
  };

  const handleAddShipment = (form) => {
    setShipments((prev) => [...prev, buildShipment(form)]);
    setActiveSection('Shipments');
  };

  const handleUpdateShipmentStatus = (shipmentId, nextStatus) => {
    setShipments((prev) =>
      prev.map((shipment) =>
        shipment.id === shipmentId
          ? {
              ...shipment,
              status: nextStatus,
            }
          : shipment,
      ),
    );
  };

  if (!role) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
        <Navbar role={role} onLogout={handleLogout} />
        <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
          <Sidebar role={role} activeSection={activeSection} onSectionChange={setActiveSection} />
          <main className="min-w-0">
            {role === 'employee' ? (
              <EmployeeDashboard
                shipments={sortedShipments}
                activeSection={activeSection}
                onAddShipment={handleAddShipment}
              />
            ) : (
              <ManagerDashboard
                shipments={sortedShipments}
                activeSection={activeSection}
                onUpdateShipmentStatus={handleUpdateShipmentStatus}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
