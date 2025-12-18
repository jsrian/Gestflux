import { Style, Circle, Fill, Stroke, Text } from 'ol/style';

export const createHospitalStyle = (status: string) => {
  const colorMap: Record<string, string> = {
    empty: '#22c55e',    
    moderate: '#eab308', 
    full: '#ef4444',   
    default: '#94a3b8'
  };

  return new Style({
    image: new Circle({
      radius: 8,
      fill: new Fill({ color: colorMap[status] || colorMap.default }),
      stroke: new Stroke({ color: 'white', width: 2 }),
    }),
  });
};

export const createUserStyle = () => {
  return new Style({
    image: new Circle({
      radius: 10,
      fill: new Fill({ color: '#2563eb' }),
      stroke: new Stroke({ color: 'white', width: 4 }),
    }),
    text: new Text({
      text: 'VOCÊ',
      offsetY: -20,
      font: 'bold 14px sans-serif',
      fill: new Fill({ color: '#1e3a8a' }),
      stroke: new Stroke({ color: 'white', width: 3 })
    })
  });
};