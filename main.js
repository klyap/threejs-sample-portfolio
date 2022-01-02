import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer =  new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);

camera.position.setZ(30);
camera.position.setX(-3);
renderer.render(scene, camera);

// Add planet with ring
const geometry = new THREE.TorusGeometry(4, 0.4, 5, 50);
const material = new THREE.MeshStandardMaterial({color: 0x52ff13});
const torus = new THREE.Mesh(geometry, material);

const sphereGeometry = new THREE.SphereGeometry(2, 24, 24);
const sphereMaterial = new THREE.MeshStandardMaterial({color: 0x52ff13});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere, torus);

// Add stars
const addStar = () => {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);
  // Generate random x y z coordinates
  const [x, y, z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
// Nifty for-loop
Array(200).fill().map(() => addStar());

// Background
const spaceTexture = new THREE.TextureLoader().load('galaxy.jpg');
scene.background = spaceTexture;

// Cube
const cubeTexture = new THREE.TextureLoader().load('galaxy.jpg');
const cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
const cubeMaterial = new THREE.MeshBasicMaterial({ map: cubeTexture});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(4, -1, -13);

scene.add(cube);

// Moon
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('moon_texture.jpeg'),
    normalMap: new THREE.TextureLoader().load('moon_normal_map.jpeg')

  })
);
moon.position.z = 9;
moon.position.x = -10;
scene.add(moon);

// Add light
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);
const ambientLight = new THREE.AmbientLight();
scene.add(pointLight,ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper,gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

const animate = (shapes) => {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.001;
  torus.rotation.z += 0.01;
  sphere.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

animate();

const moveCamera = () => {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  if (t > 0) {
    cube.rotation.y = -0.1;
    cube.rotation.z = 0;
    cube.rotation.x = 0;
  } else {
    cube.rotation.y += 0.1;
    cube.rotation.z += 0.1;
  }


  camera.position.z = (t - 8) * -0.01;
  camera.position.x = (t - 8) * -0.0002;
  camera.rotation.y = (t - 8) * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();