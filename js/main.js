// import libraries

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// create a scene
const scene = new THREE.Scene();

 // scene.fog = new THREE.Fog(0x1c5d50, 12, 22);
//create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// create a renderer
const renderer = new THREE.WebGLRenderer( { alpha: true });

// instantiate OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = .35;
controls.maxDistance = 200;

const meshLoader = new GLTFLoader();

// GLTF LOADER ------- the gltf model using the gltf loader library
meshLoader.load(
  'https://raw.githubusercontent.com/510home/iso-night-drive/main/models/lancer_DG_body_A.glb',
  (gltf) => {
    const lancer = gltf.scene;
    lancer.scale.set(1.35, 1.35, 1.35);
    lancer.position.set(-0.07, 0, -0.55);
    scene.add(lancer);
  },
);

meshLoader.load(
  'https://raw.githubusercontent.com/510home/iso-night-drive/main/models/wheels_1x_02.glb',
  (gltf) => {
    const wheelsfront = gltf.scene;
    wheelsfront.scale.set(1, 1, 1);
    wheelsfront.position.set(0.985, 0.2, -0.525);
    scene.add(wheelsfront);
  }
);


// add renderer to the Document Object Model (DOM)
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

// camera position
camera.position.set(0, 1, 2);

// add light to the scene
const ambientLight = new THREE.AmbientLight(0xdf8842, .5);
 scene.add(ambientLight);

 const topLight = new THREE.DirectionalLight(0xffffff, 3.5);
 topLight.position.set(0, 1, 0);
 scene.add(topLight);

 function animate() {
  requestAnimationFrame(animate);
  //wheelsfront.rotation.z = t * Math.PI * 2 * 9;
 
renderer.render(scene, camera);
 }

// event listener watches for window changes in order to resize and rerender the window
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// start rendering the scene
animate ();