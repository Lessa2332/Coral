// customThreejsModule.js
// Повністю замінює стандартний XR8.Threejs.pipelineModule().
// Створює власний Three.js рендерер, сцену, камеру та синхронізує їх із SLAM-трекінгом.

(function() {
  // Функція, яка повертає об'єкт модуля для конвеєра XR8
  window.customThreejsPipelineModule = function() {
    let xrScene = null; // { scene, camera, renderer }

    return {
      name: 'customThreejs',

      // Викликається один раз, коли камера запускається
      onStart: ({ canvas }) => {
        // Створюємо Three.js компоненти
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: false });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true; // увімкнення тіней, якщо потрібно

        xrScene = { scene, camera, renderer };

        // Забезпечуємо сумісність з кодом, який очікує XR8.Threejs.xrScene()
        window.XR8.Threejs = window.XR8.Threejs || {};
        window.XR8.Threejs.xrScene = () => xrScene;

        // Анімаційний цикл для рендерингу
        const animate = () => {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        };
        animate();

        // Повертаємо об'єкт, якщо потрібно (не обов'язково)
        return xrScene;
      },

      // Викликається кожен кадр після оновлення SLAM-трекінгу
      onUpdate: ({ processCpuResult }) => {
        if (!xrScene) return;
        const { camera } = xrScene;
        const { position, orientation } = processCpuResult.camera;
        camera.position.set(position.x, position.y, position.z);
        camera.quaternion.set(orientation.x, orientation.y, orientation.z, orientation.w);
      },
    };
  };
})();
