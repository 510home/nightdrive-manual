// import libraries

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';

// create a scene - Fog is set to temp colors for now
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000022);
scene.fog = new THREE.Fog(0x000000, 1, 12);

//create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(1.5, 2, 2);
    camera.lookAt(0.5, 0.5, -2);


// create a renderer
const renderer = new THREE.WebGLRenderer( { alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const renderScene = new RenderPass(scene, camera);
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
   // bloomPass.threshold = 0;
  //  bloomPass.strength = 1.5;
  //  bloomPass.radius = 0;
    composer.addPass(bloomPass);

// mesh variable for street
let mesh = addRoad(scene);

// chron setting for street animation
let chron = 0;

// instantiate OrbitControls
/*
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = .35;
controls.maxDistance = 20;
*/
// instantiate GLTFLoader for models
const meshLoader = new GLTFLoader();

//Synthwave Moon ────────────────────── a circle for the camera to look at
const circle = new THREE.CircleGeometry( 2, 60);
const moonmat = new THREE.MeshBasicMaterial( { color: 0xff66ff } );
const moon = new THREE.Mesh( circle, moonmat);
moon.position.set(1, 1, -6);
scene.add( moon )

// GLTF LOADER ------- the gltf model using the gltf loader library
meshLoader.load(
  'https://raw.githubusercontent.com/510home/iso-night-drive/main/models/lancer_DG_body_B.glb',
  (gltf) => {
    const lancer = gltf.scene;
    lancer.scale.set(.99, .99, .99);
    lancer.position.set(-0.07, 0.06, -0.55);
    lancer.rotation.set(0, 0, 0);
    lancer.castShadow = true;
    lancer.receiveShadow = true;
    scene.add(lancer);
  }
);
let wheelsFront;
meshLoader.load(
  'https://raw.githubusercontent.com/510home/iso-night-drive/main/models/wheels_1x_02.glb',
  (gltf) => {
    wheelsFront = gltf.scene;
    wheelsFront.scale.set(1, 1, 1);
    wheelsFront.position.set(0.985, 0.2, -0.525);
    wheelsFront.rotation.z = 0;
    scene.add(wheelsFront);
  }
);

var wheelsBack;
meshLoader.load(
  'https://raw.githubusercontent.com/510home/iso-night-drive/main/models/wheels_1x_02.glb',
  (gltf) => {
    wheelsBack = gltf.scene;
    wheelsBack.scale.set(.97, .97, .97);
    wheelsBack.position.set(-0.72, 0.2, -0.525);
    wheelsBack.rotation.z = 0;
    scene.add(wheelsBack);
  }
);

// ── Ground Plane 02 (16 m wide × 4 m long) ───────────────────────────────
// this long narrow plane holds the animated asphalt street texture
    function addRoad(scene) {
    const texPLane = new THREE.PlaneGeometry(96, 4);
    const texLoader = new THREE.TextureLoader();
    const streetmap = texLoader.load('https://raw.githubusercontent.com/510home/iso-night-drive/main/tex/asphalt01x.jpg');  
      streetmap.wrapS = THREE.RepeatWrapping;
      streetmap.wrapT = THREE.RepeatWrapping;
      streetmap.repeat.set(1, 1);  

    const streetMat = new THREE.MeshStandardMaterial ({
      map: streetmap,
      transparent: false,
      metalness: 0.2,
      roughness: 0.5,     
      side: THREE.DoubleSide
    });
    
    const plane02tex = new THREE.Mesh(texPLane, streetMat);
    plane02tex.rotation.x = -Math.PI / 2;
    plane02tex.receiveShadow = true;
    plane02tex.position.set(0, 0, 0.25);
    scene.add(plane02tex);
    return plane02tex;
      }
    
// subtle grid lines on the ground ───────────────────────────────
    const gridHelper = new THREE.GridHelper(16, 32, 0x4815e3, 0x204693);
    gridHelper.position.y = 0.001;
//    scene.add(gridHelper);

// add renderer to the Document Object Model (DOM)
 //   renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container3D').appendChild(renderer.domElement);

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
  spot1.castShadow = true;
  makeSpot(0x8ba9f3, 6, 5, 3, 0, -.5, .125, 0);

// event listener watches for window changes in order to resize and rerender the window
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  composer.setSize(window.innerWidth, window.innerHeight);

});

 let time = Date.now()
function animate() {
  requestAnimationFrame(animate); 
const currentTime = Date.now()
const deltaTime = currentTime - time
time = currentTime
wheelsBack.rotation.z -= 0.04 * deltaTime;
wheelsFront.rotation.z -= 0.04 * deltaTime;
chron++;
mesh.material.map.offset.x = chron * -0.0075;
// controls.update();
//renderer.clear();
//renderer.render(scene, camera);
composer.render();
 }

// start rendering the scene
animate ();
