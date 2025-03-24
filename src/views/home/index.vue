<template>
  <div ref="container" id="container"></div>
</template>

<script>
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { onMounted, onUnmounted, ref } from 'vue';

export default {
  name: 'ThreeScene',
  setup() {
    const container = ref(null);

    let mixer;
    const clock = new THREE.Clock();
    let renderer, scene, camera, controls, stats;

    onMounted(() => {
      init();
      animate();
    });

    onUnmounted(() => {
      if (renderer) {
        renderer.dispose();
      }
    });

    function init() {
      // 初始化渲染器
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.value.appendChild(renderer.domElement);

      // 初始化场景
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xbfe3dd);

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(
        new RoomEnvironment(),
        0.04,
      ).texture;

      // 初始化相机
      camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        100,
      );
      camera.position.set(5, 2, 8);

      // 初始化控制器
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0.5, 0);
      controls.update();
      controls.enablePan = false;
      controls.enableDamping = true;

      // 初始化统计信息
      stats = new Stats();
      stats.dom.style.position = 'absolute';
      container.value.appendChild(stats.dom);

      // 初始化 GLTF 加载器
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/jsm/libs/draco/gltf/');
      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);
      loader.load(
        '/models/gltf/LittlestTokyo.glb',
        function (gltf) {
          const model = gltf.scene;
          model.position.set(1, 1, 0);
          model.scale.set(0.01, 0.01, 0.01);
          scene.add(model);

          mixer = new THREE.AnimationMixer(model);
          mixer.clipAction(gltf.animations[0]).play();
        },
        undefined,
        function (e) {
          console.error(e);
        },
      );

      // 窗口大小调整事件
      window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();

      if (mixer) {
        mixer.update(delta);
      }

      controls.update();
      stats.update();

      renderer.render(scene, camera);
    }

    return {
      container,
    };
  },
};
</script>

<style scoped>
#container {
  width: 100%;
  height: 100vh;
}
</style>
