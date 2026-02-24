import { fcfsResponse } from './lib/algorithms';
const processes = [
    { id: 'P6', arrivalTime: 5, priority: 1, bursts: [{ type: 'CPU', duration: 8 }], memoryRequired: 128 },
    { id: 'P2', arrivalTime: 6, priority: 1, bursts: [{ type: 'CPU', duration: 8 }], memoryRequired: 128 },
    { id: 'P3', arrivalTime: 7, priority: 1, bursts: [{ type: 'CPU', duration: 8 }], memoryRequired: 128 },
    { id: 'P4', arrivalTime: 8, priority: 1, bursts: [{ type: 'CPU', duration: 8 }], memoryRequired: 128 },
];
console.log(JSON.stringify(fcfsResponse(processes), null, 2));
