const { readFileSync } = require('fs');
const tsContent = readFileSync('./lib/algorithms.ts', 'utf-8');

// A quick hack to run the ts logic in node:
const tsc = require('typescript');
const jsCode = tsc.transpileModule(tsContent, { compilerOptions: { module: tsc.ModuleKind.CommonJS } }).outputText;

const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function() {
  if (arguments[0] === './types') return {};
  return originalRequire.apply(this, arguments);
};

const m = new module.constructor();
m.paths = module.paths;
m._compile(jsCode, 'temp.js');

const fcfsResponse = m.exports.fcfsResponse;

const processes = [
    { id: 'P6', arrivalTime: 5, priority: 1, bursts: [{ type: 'CPU', duration: 8 }], memoryRequired: 128 },
    { id: 'P2', arrivalTime: 6, priority: 1, bursts: [{ type: 'CPU', duration: 8 }], memoryRequired: 128 },
];

console.log(JSON.stringify(fcfsResponse(processes), null, 2));
