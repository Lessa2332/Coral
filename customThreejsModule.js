// customThreejsModule.js
(function() {
  window.customThreejsPipelineModule = function() {
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
        renderer.shadowMap.enabled = true;

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
  };
})();
