import type { Hospital } from "@/domain/entities/hospital.entity";

export const hospitals: Hospital[] = [
  {
    id: 1,
    name: "Hospital de Emergência e Trauma Senador Humberto Lucena",
    address: "Av. Sanitarista Nilo Batista, Centro - João Pessoa",
    waitingTime: "25 min",
    queueSize: 18,
    status: 'medium',
    coordinates: { x: 45, y: 55 },
    specialties: ["emergência", "trauma", "cirurgia", "neurologia"],
    phone: "(83) 3218-7070",
    distance: "8.2 km"
  },
  {
    id: 2,
    name: "Hospital Universitário Lauro Wanderley",
    address: "Campus I UFPB, Cidade Universitária - João Pessoa",
    waitingTime: "45 min",
    queueSize: 32,
    status: 'high',
    coordinates: { x: 35, y: 40 },
    specialties: ["clínica geral", "cardiologia", "pediatria", "ginecologia"],
    phone: "(83) 3216-7777",
    distance: "12.5 km"
  },
  {
    id: 3,
    name: "Hospital Metropolitano",
    address: "Rua Dep. Odon Bezerra, Santa Rosa - João Pessoa",
    waitingTime: "15 min",
    queueSize: 8,
    status: 'low',
    coordinates: { x: 65, y: 30 },
    specialties: ["emergência", "cardiologia", "neurologia", "ortopedia"],
    phone: "(83) 3216-4000",
    distance: "4.8 km"
  },
  {
    id: 4,
    name: "Complexo Hospitalar de Mangabeira",
    address: "Rua Projetada, Mangabeira VIII - João Pessoa",
    waitingTime: "35 min",
    queueSize: 24,
    status: 'medium',
    coordinates: { x: 25, y: 75 },
    specialties: ["clínica geral", "pediatria", "ginecologia", "psiquiatria"],
    phone: "(83) 3212-3000",
    distance: "15.3 km"
  },
  {
    id: 5,
    name: "Hospital Santa Isabel",
    address: "Av. Gen. Edson Ramalho, Manaíra - João Pessoa",
    waitingTime: "20 min",
    queueSize: 12,
    status: 'low',
    coordinates: { x: 75, y: 20 },
    specialties: ["cardiologia", "neurologia", "ortopedia", "consultas"],
    phone: "(83) 2107-4444",
    distance: "1.2 km"
  },
  {
    id: 6,
    name: "Hospital Português",
    address: "Av. Dom Pedro II, Torre - João Pessoa",
    waitingTime: "30 min",
    queueSize: 16,
    status: 'medium',
    coordinates: { x: 55, y: 35 },
    specialties: ["clínica geral", "cardiologia", "gastroenterologia", "urologia"],
    phone: "(83) 2107-2500",
    distance: "6.5 km"
  }
];
