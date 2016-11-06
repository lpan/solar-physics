import { SphereGeometry, MeshLambertMaterial, Mesh } from 'three';
import { SCALE, G } from './constants';

class Planet {
  /**
   * @param planet {name, color, diameter, orbit, mass}
   * @param velocity {number} - x component of velocity
   *
   */
  constructor(planet, velocity) {
    const { color, orbit, diameter } = planet;

    this.planet = planet;
    this.position = { x: orbit, y: 0 };
    this.velocity = { x: 0, y: velocity };
    this.mesh = new Mesh(
      new SphereGeometry(diameter / 2, 50, 50),
      new MeshLambertMaterial({ color })
    );
    this.mesh.position.set(orbit * SCALE, 0, 0);
    this.force = { x: 0, y: 0 };
  }

  updateVelocity = () => {
    this.velocity.x += this.force.x / this.planet.mass;
    this.velocity.y += this.force.y / this.planet.mass;
  }

  updatePosition = () => {
    const { position, mesh, velocity, planet } = this;
    position.x += velocity.x / planet.mass * 8640000;
    position.y += velocity.y / planet.mass * 8640000;
    mesh.position.set(position.x, position.y);
  }

  setProp = prop => ({ x, y }) => {
    this[prop] = { x, y };
  }

  getAttractiveForce = other => {
    const dx = other.position.x - this.position.x;
    const dy = other.position.y - this.position.y;

    const distance = Math.sqrt(dx * dx + dy * dy);
    // TODO handle collision

    const force = G * this.planet.mass * other.planet.mass / Math.pow(distance, 2);
    const theta = Math.atan2(dy, dx);

    if (this.planet.name === 'earth') {
      console.warn(other.position.x);
      console.warn(this.position.x);
      console.warn(dx);
    }

    return { x: Math.cos(theta) * force, y: Math.sin(theta) * force };
  }
}

export default Planet;
