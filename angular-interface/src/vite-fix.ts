// Configuração para resolver problemas do Vite overlay
if (typeof window !== 'undefined') {
  // Desabilitar overlay de erro do Vite se estiver causando problemas
  const viteErrorOverlay = document.querySelector('vite-error-overlay');
  if (viteErrorOverlay) {
    viteErrorOverlay.remove();
  }
  
  // Interceptar erros do cliente Vite
  const originalError = console.error;
  console.error = function(...args) {
    const message = args[0];
    if (typeof message === 'string' && 
        (message.includes('Failed to update Vite client error overlay') ||
         message.includes('loadViteClientCode'))) {
      return; // Suprimir este erro específico
    }
    originalError.apply(console, args);
  };
}