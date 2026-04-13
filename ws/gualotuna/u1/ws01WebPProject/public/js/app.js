import { AppController } from './controllers/AppController.js';

(function iniciarAplicacion() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    try {
      const app = new AppController();
      app.inicializar();

      window.app = app;
    } catch (error) {
      console.error('❌ Error al iniciar la aplicación:', error);
      mostrarErrorCritico(error);
    }
  }

  function mostrarErrorCritico(error) {
    const container = document.querySelector('.container');
    if (container) {
      container.innerHTML = `
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          margin: 2rem auto;
          max-width: 600px;
        ">
          <h2>⚠️ Error al iniciar la aplicación</h2>
          <p>Por favor, recarga la página o contacta al administrador.</p>
          <details style="margin-top: 1rem; text-align: left;">
            <summary style="cursor: pointer;">Ver detalles técnicos</summary>
            <pre style="
              background: rgba(0,0,0,0.2);
              padding: 1rem;
              border-radius: 8px;
              margin-top: 1rem;
              overflow-x: auto;
            ">${error.stack || error.message}</pre>
          </details>
        </div>
      `;
    }
  }
})();
