const { exec } = require('child_process');
const http = require('http');

const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function checkFrontend() {
  return new Promise((resolve) => {
    http.get(FRONTEND_URL, (res) => {
      if (res.statusCode === 200) {
        resolve({ status: 'running', port: 5173 });
      } else {
        resolve({ status: 'error', port: 5173 });
      }
    }).on('error', () => {
      resolve({ status: 'error', port: 5173 });
    });
  });
}

function checkBackend() {
  return new Promise((resolve) => {
    http.get(`${BACKEND_URL}/health`, (res) => {
      if (res.statusCode === 200) {
        resolve({ status: 'running', port: 3001 });
      } else {
        resolve({ status: 'error', port: 3001 });
      }
    }).on('error', () => {
      resolve({ status: 'error', port: 3001 });
    });
  });
}

function clearConsole() {
  process.stdout.write('\x1Bc');
}

function printStatus(frontend, backend) {
  clearConsole();
  console.log('=== Status do Sistema ===\n');
  
  console.log('Frontend:');
  console.log(`Status: ${frontend.status === 'running' ? '🟢 Rodando' : '🔴 Erro'}`);
  console.log(`Porta: ${frontend.port}\n`);
  
  console.log('Backend:');
  console.log(`Status: ${backend.status === 'running' ? '🟢 Rodando' : '🔴 Erro'}`);
  console.log(`Porta: ${backend.port}\n`);
  
  console.log('=======================');
}

async function monitor() {
  while (true) {
    const [frontend, backend] = await Promise.all([
      checkFrontend(),
      checkBackend()
    ]);
    
    printStatus(frontend, backend);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

console.log('Iniciando monitoramento...\n');
monitor(); 