import * as THREE from 'three';
import { AU, SCALE } from './constants';
import Planet from './Planet';
import { remove, mergeWith, add, map, compose, reduce } from 'ramda';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const clock = new THREE.Clock();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 0.5);

const sun = new Planet({
  name: 'sun',
  color: 'yellow',
  orbit: 0,
  mass: 1.99 * Math.pow(10, 30),
  diameter: 9
}, 0);

const earth = new Planet({
  name: 'earth',
  color: 'blue',
  orbit: 1.5 * Math.pow(10, 11),
  mass: 5.97 * Math.pow(10, 24),
  diameter: 4
}, 29.783 * 1000);

const pointLight = new THREE.PointLight('#ffffff', 1, 1000);

pointLight.position.set(50, 50, 200);
camera.position.z = 50;

scene.add(pointLight);
scene.add(sun.mesh);
scene.add(earth.mesh);

document.body.appendChild(renderer.domElement);

const planets = [sun, earth];

function updatePosition() {
  planets.forEach((planet, i) => {
    const removeFocused = remove(i, 1);
    const mapToForce = map(other => planet.getAttractiveForce(other));
    const sumForce = reduce((accum, current) => mergeWith(add, accum, current), { x: 0, y: 0 });
    planet.setProp('force')(compose(sumForce, mapToForce, removeFocused)(planets));
  });

  planets.forEach(planet => {
    planet.updateVelocity();
    planet.updatePosition();
    if (planet.planet.name === 'sun') {
      // console.warn(planet.position.x);
    }
  });
}

function render() {
  requestAnimationFrame(render);
  updatePosition();
  renderer.render(scene, camera);
}

render();
