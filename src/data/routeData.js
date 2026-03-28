const cityCoordinates = {
  Mumbai: [72.8777, 19.076],
  Delhi: [77.1025, 28.7041],
  Bengaluru: [77.5946, 12.9716],
  Chennai: [80.2707, 13.0827],
  Pune: [73.8567, 18.5204],
  Hyderabad: [78.4867, 17.385],
  Jaipur: [75.7873, 26.9124],
  Ahmedabad: [72.5714, 23.0225],
  Kolkata: [88.3639, 22.5726],
  Surat: [72.8311, 21.1702],
};

const routeDefinitions = [
  {
    id: 'shortest',
    name: 'Shortest Distance',
    color: '#2563eb',
    badge: 'Best Route',
    distanceFactor: 1,
    timeFactor: 1.08,
    fuelFactor: 0.98,
    controlBias: [0.3, 0.12],
  },
  {
    id: 'fastest',
    name: 'Fastest Time',
    color: '#f97316',
    badge: 'Best Route',
    distanceFactor: 1.08,
    timeFactor: 0.92,
    fuelFactor: 1.12,
    controlBias: [0.46, -0.05],
  },
  {
    id: 'eco',
    name: 'Fuel-Efficient',
    color: '#0f9d8f',
    badge: 'Eco-Friendly Option',
    distanceFactor: 1.04,
    timeFactor: 1.02,
    fuelFactor: 0.82,
    controlBias: [0.56, 0.08],
  },
];

const hashText = (value) =>
  value.split('').reduce((total, char, index) => total + char.charCodeAt(0) * (index + 1), 0);

const fallbackCoordinates = (name) => {
  const hash = hashText(name || 'india');
  const lng = 68 + (hash % 1700) / 100;
  const lat = 8 + ((hash / 17) % 2600) / 100;
  return [Number(lng.toFixed(4)), Number(lat.toFixed(4))];
};

export const getLocationCoordinates = (name) => cityCoordinates[name] || fallbackCoordinates(name);

const midpoint = (start, end, bias) => {
  const [sx, sy] = start;
  const [ex, ey] = end;
  const [bx, by] = bias;
  return [
    Number((sx + (ex - sx) * bx).toFixed(4)),
    Number((sy + (ey - sy) * (1 - bx) + by).toFixed(4)),
  ];
};

const calcBaseDistance = (start, end) => {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  return Math.sqrt(dx * dx + dy * dy) * 111;
};

export const getShipmentRouteInsights = (shipment) => {
  if (!shipment) {
    return null;
  }

  const sourceCoords = getLocationCoordinates(shipment.source);
  const destinationCoords = getLocationCoordinates(shipment.destination);
  const baseDistance = calcBaseDistance(sourceCoords, destinationCoords);
  const baselineFuel = baseDistance * 0.38;
  const baselineCo2 = baselineFuel * 2.64;

  const routes = routeDefinitions.map((route) => {
    const distance = Math.max(90, baseDistance * route.distanceFactor);
    const time = Math.max(2.2, (distance / 58) * route.timeFactor);
    const fuel = Math.max(24, baselineFuel * route.fuelFactor);
    const co2 = fuel * 2.64;
    const savedFuelPercent = ((baselineFuel - fuel) / baselineFuel) * 100;
    const reducedCo2 = Math.max(0, baselineCo2 - co2);
    const ecoScore = Math.max(58, Math.min(97, Math.round(100 - route.fuelFactor * 18 - route.timeFactor * 8)));
    const controlPoint = midpoint(sourceCoords, destinationCoords, route.controlBias);

    return {
      ...route,
      distance: Number(distance.toFixed(1)),
      time: Number(time.toFixed(1)),
      fuel: Number(fuel.toFixed(1)),
      co2: Number(co2.toFixed(1)),
      fuelSavedPercent: Number(Math.max(0, savedFuelPercent).toFixed(1)),
      co2Reduced: Number(reducedCo2.toFixed(1)),
      ecoScore,
      geometry: {
        type: 'LineString',
        coordinates: [sourceCoords, controlPoint, destinationCoords],
      },
    };
  });

  const bestRouteId = routes.reduce((best, route) =>
    route.fuel < best.fuel ? route : best,
  ).id;

  return {
    sourceCoords,
    destinationCoords,
    routes,
    bestRouteId,
    comparisonData: routes.map((route) => ({
      name: route.id === 'shortest' ? 'Shortest' : route.id === 'fastest' ? 'Fastest' : 'Eco',
      distance: route.distance,
      time: route.time,
      fuel: route.fuel,
    })),
  };
};
