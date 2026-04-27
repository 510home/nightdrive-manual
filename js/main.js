// import libraries

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// create a scene
const scene = new THREE.Scene();
 scene.background = new THREE.Color(0x0a0c0f);
  scene.fog = new THREE.Fog(0x000000, 2, 8);

 // scene.fog = new THREE.Fog(0x1c5d50, 12, 22);
//create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(2, 1, 3);
    camera.lookAt(0, 0.5, 0);

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
  'https://raw.githubusercontent.com/510home/iso-night-drive/main/models/lancer_DG_body_B.glb',
  (gltf) => {
    const lancer = gltf.scene;
    lancer.scale.set(.99, .99, .99);
    lancer.position.set(-0.07, 0.06, -0.55);
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

meshLoader.load(
  'https://raw.githubusercontent.com/510home/iso-night-drive/main/models/wheels_1x_02.glb',
  (gltf) => {
    const wheelsback = gltf.scene;
    wheelsback.scale.set(.97, .97, .97);
    wheelsback.position.set(-0.72, 0.2, -0.525);
    scene.add(wheelsback);
  }
);

// ── Ground Plane 02 (16 m wide × 4 m long) ─────────────────────────────────

    const texPLane = new THREE.PlaneGeometry(96, 4);
    const texLoader = new THREE.TextureLoader();
    const streetmap = texLoader.load('https://raw.githubusercontent.com/510home/iso-night-drive/main/tex/asphalt01x.jpg', (tex01) => {  
      tex01.wrapS = tex01.wrapT = THREE.RepeatWrapping;
     tex01.repeat.set(2, 1);
    });  

    
    const streetMat = new THREE.MeshStandardMaterial ({
      metalness: 0.2,
      roughness: 0.5,
      map: streetmap,
      side: THREE.DoubleSide,
    });
    
    const plane02tex = new THREE.Mesh(texPLane, streetMat);
    
    plane02tex.rotation.x = -Math.PI / 2;
    plane02tex.receiveShadow = true;
    plane02tex.position.set(0, 0, -1);
    scene.add(plane02tex);
    
    // subtle grid lines on the ground ───────────────────────────────
    const gridHelper = new THREE.GridHelper(16, 32, 0x2a2a3a, 0x2a2a3a);
    gridHelper.position.y = 0.001;
  //  scene.add(gridHelper);


// add renderer to the Document Object Model (DOM)
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

 //   const hemiLight = new THREE.HemisphereLight(0x4815e3, 0x0a0a0f, 0.02);
  //  scene.add(hemiLight);

// add light to the scene
//const ambientLight = new THREE.AmbientLight(0xdf8842, .02);
 //scene.add(ambientLight);

  /* ── spotlights ── */
  function makeSpot(color, intensity, x, y, z, tx, ty, tz) {
    const s = new THREE.SpotLight(color, intensity);
    s.position.set(x, y, z);
    s.angle = Math.PI / 7;
    s.penumbra = 0.35;
    s.decay = 1.8;
    s.distance = 12;
    s.castShadow = true;
    s.shadow.mapSize.width = s.shadow.mapSize.height = 1024;
    s.shadow.camera.near = 0.5;
    s.shadow.camera.far  = 14;
    s.target.position.set(tx, ty, tz);
    scene.add(s);
    scene.add(s.target);
    return s;
  }

  const spot1 = makeSpot(0xfff4d0, 2,  1, 5,  3, 0, 0, 0);
  spot1.castShadow = false;
  makeSpot(0x8ba9f3, 6, 5, 3, 0, -.5, .125, 0);

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
