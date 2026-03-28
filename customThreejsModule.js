// customThreejsModule.js
// Цей модуль замінює XR8.Threejs.pipelineModule() у xr-standalone.

export function customThreejsPipelineModule() {
  let xrScene = null; // { scene, camera, renderer }

  return {
    name: 'customThreejs',

    onStart: ({ canvas }) => {
      // Створення Three.js компонентів
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: false });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true; // якщо потрібні тіні

      xrScene = { scene, camera, renderer };

      // Зробити глобально доступним (як очікують інші модулі)
      window.XR8.Threejs = window.XR8.Threejs || {};
      window.XR8.Threejs.xrScene = () => xrScene;

      // Анімаційний цикл
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      // Повертаємо об'єкт, щоб інші частини коду могли додавати свої логіки
      return xrScene;
    },

    onUpdate: ({ processCpuResult }) => {
      if (!xrScene) return;
      const { camera } = xrScene;
      const { position, orientation } = processCpuResult.camera;
      camera.position.set(position.x, position.y, position.z);
      camera.quaternion.set(orientation.x, orientation.y, orientation.z, orientation.w);
    },
  };
}