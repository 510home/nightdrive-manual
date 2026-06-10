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
//scene.fog = new THREE.Fog(0x000000, 1, 12);

//create a CAMERA
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.set(5, 0.5, 0);
    camera.rotation.set(
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(60),
        THREE.MathUtils.degToRad(60),
        );

// create a renderer
const renderer = new THREE.WebGLRenderer( { alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const renderScene = new RenderPass(scene, camera);
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
// BLOOM PASS SETTINGS ------ Synthwave Glow
 const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight), 8, 4, 0.75);
    bloomPass.threshold = 0.25;
  bloomPass.strength = 1;
  bloomPass.radius = .65;
   composer.addPass(bloomPass);

// add renderer to the Document Object Model (DOM)
//  renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

// ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
//controls.enableZoom = false;
controls.minDistance = 1;
controls.maxDistance = 6;
//controls.enablePan = false;
controls.target = new THREE.Vector3(0, .75, -1);
controls.maxAzimuthAngle = THREE.MathUtils.degToRad(30);
controls.minAzimuthAngle = THREE.MathUtils.degToRad(-20);
controls.maxPolarAngle = THREE.MathUtils.degToRad(30); 
//controls.minPolarAngle = THREE.MathUtils.degToRad(-30);


// MOON ────────────────────── 
const circle = new THREE.CircleGeometry( 6, 48);
const moonmaps = new THREE.TextureLoader();
const moonalpha = moonmaps.load('https://raw.githubusercontent.com/510home/nightdrive-manual/main/tex/Moonsky_01_2400.jpg');
const mooncolor = moonmaps.load('https://raw.githubusercontent.com/510home/nightdrive-manual/main/tex/Moonsky_01_2400.jpg');
const moonmat = new THREE.MeshStandardMaterial({
map: mooncolor,
emissiveMap: mooncolor,
receiveShadow: false,
emissive: new THREE.Color(0xffffff),
emissiveIntensity: 0.32,
  alphaMap: moonalpha,
  transparent: true,
});
const moon = new THREE.Mesh( circle, moonmat);
moon.position.set(-4, 2.5, -3);
scene.add(moon);

// mesh variable for street
let mesh = addRoad(scene);

// chron setting for street animation
let chron = 0;

// instantiate GLTFLoader for models
const meshLoader = new GLTFLoader();

// GLTF LOADER ------- the gltf model using the gltf loader library
meshLoader.load(
  'https://raw.githubusercontent.com/510home/nightdrive-manual/main/lancer_DG_body_D.glb',
  (gltf) => {
    const lancer = gltf.scene;
    lancer.scale.set(.99, .99, .99);
    lancer.position.set(-0.07, 0.06, -0.55);
    lancer.rotation.set(0, 0, 0);

    lancer.traverse(o => {
        if (o.isMesh) {
          o.castShadow    = true;
          o.receiveShadow = true;
          // Ensure materials are double-sided in case normals are flipped
     //     if (o.material) o.material.side = THREE.DoubleSide;
        }
      });
    scene.add(lancer);
  }
);
let wheelsFront;
meshLoader.load(
  'https://raw.githubusercontent.com/510home/nightdrive-manual/main/lancer_wheels.glb',
  (gltf) => {
    wheelsFront = gltf.scene;
    wheelsFront.scale.set(1, 1, 1);
    wheelsFront.position.set(0.985, 0.2, -0.525);
    wheelsFront.rotation.z = 0;
    wheelsFront.receiveShadow = true;
    wheelsFront.castShadow = true;
    wheelsFront.traverse(k => {
        if (k.isMesh) {
          k.castShadow    = true;
          k.receiveShadow = true;
                    }
      });
    scene.add(wheelsFront);
  }
);

var wheelsBack;
meshLoader.load(
  'https://raw.githubusercontent.com/510home/nightdrive-manual/main/lancer_wheels.glb',
  (gltf) => {
    wheelsBack = gltf.scene;
    wheelsBack.scale.set(.97, .97, .97);
    wheelsBack.position.set(-0.72, 0.2, -0.525);
    wheelsBack.receiveShadow = true;
    wheelsBack.castShadow = true;
    wheelsBack.rotation.z = 0;
    wheelsBack.traverse(h => {
        if (h.isMesh) {
          h.castShadow    = true;
          h.receiveShadow = true;
                }
      });
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
    plane02tex.castShadow = false;
    plane02tex.receiveShadow = true;
    plane02tex.position.set(0, 0, 0.25);
    scene.add(plane02tex);
    return plane02tex;
      }

  /* ── spotlights ── */
  function makeSpot(color, intensity, x, y, z, tx, ty, tz) {
    const s = new THREE.SpotLight(color, intensity);
    s.position.set(x, y, z);
    s.angle = Math.PI / 7;
    s.penumbra = 0.35;
    s.decay = 1.2;
    s.distance = 18;
    s.castShadow = true;
    s.shadow.mapSize.width = s.shadow.mapSize.height = 2048;
    s.shadow.camera.near = 0.2;
    s.shadow.camera.far  = 30;
    s.target.position.set(tx, ty, tz);
    scene.add(s);
    scene.add(s.target);
    return s;
  }
  //const spot1 = makeSpot(0xfff4d0, 2, 1, 5, 3, 0, 0, 0);
    const spotleft = makeSpot(0x8ba9f3, 12, -3, .3, 2, -.5, 1.25, 0.5);
    
//  spot1.castShadow = true;
    const spotright = makeSpot(0x8ba9f3, 8, -1, 3, -3, 0, 1, -1);

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
moon.lookAt(camera.position);
time = currentTime
wheelsBack.rotation.z -= 0.04 * deltaTime;
wheelsFront.rotation.z -= 0.04 * deltaTime;
chron++;
mesh.material.map.offset.x = chron * -0.0075;
composer.render();
 }

// start rendering the scene
animate ();
