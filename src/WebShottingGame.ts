import { LitElement, html, css } from 'lit';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

export class WebShottingGame extends LitElement {
  static styles = css`
    canvas {
      width: 100vw;
      height: 100vh;
    }
  `;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera();

  renderer = new THREE.WebGLRenderer();

  ground = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
    })
  );

  control = new PointerLockControls(this.camera, document.body);

  clock = new THREE.Clock();

  moves = {
    right: 0,
    forward: 0,
    up: 0,
  };

  velocity = new THREE.Vector3();

  direction = new THREE.Vector3();

  constructor() {
    super();
    this.ground.rotation.set(0.5 * Math.PI, 0, 0);
    this.camera.position.set(0, 0.5, 0);
    this.scene.add(this.ground, this.control.getObject());
  }

  connectedCallback() {
    super.connectedCallback();
    this.draw();
    this.handleChangeSize();
    window.addEventListener('resize', this.handleChangeSize);
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.handleChangeSize);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  private handleChangeSize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  };

  private animation = () => {
    const delta = this.clock.getDelta();
    this.velocity.x -= this.velocity.x * 10 * delta;
    this.velocity.z -= this.velocity.z * 10 * delta;
    this.velocity.y -= 9.8 * this.velocity.y * 100 * delta;

    this.direction.z = this.moves.forward;
    this.direction.x = this.moves.right;
    this.direction.normalize();

    if (this.moves.forward) this.velocity.z -= this.direction.z * 40 * delta;
    if (this.moves.right) this.velocity.x -= this.direction.x * 40 * delta;

    this.control.moveRight(-this.velocity.x * delta);
    this.control.moveForward(-this.velocity.z * delta);
  };

  private draw = () => {
    if (this.isConnected) {
      requestAnimationFrame(this.draw);
    }

    this.animation();
    this.renderer.render(this.scene, this.camera);
  };

  private lock = () => {
    this.control.lock();
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'd':
        this.moves.right = 1;
        break;
      case 'ArrowLeft':
      case 'a':
        this.moves.right = -1;
        break;
      case 'ArrowUp':
      case 'w':
        this.moves.forward = 1;
        break;
      case 'ArrowDown':
      case 's':
        this.moves.forward = -1;
        break;
      default:
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'd':
        this.moves.right = 0;
        break;
      case 'ArrowLeft':
      case 'a':
        this.moves.right = 0;
        break;
      case 'ArrowUp':
      case 'w':
        this.moves.forward = 0;
        break;
      case 'ArrowDown':
      case 's':
        this.moves.forward = 0;
        break;
      default:
    }
  };

  render() {
    return html`<main @mousedown="${this.lock}">
      ${this.renderer.domElement}
    </main>`;
  }
}
