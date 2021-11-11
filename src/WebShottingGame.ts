import { LitElement, html, css } from 'lit';
import * as THREE from 'three';

export class WebShottingGame extends LitElement {
  static styles = css`
    canvas {
      width: 100vw;
      height: 100vh;
    }
  `;

  scene = new THREE.Scene();

  camera = new THREE.Camera();

  renderer = new THREE.WebGLRenderer();

  connectedCallback() {
    super.connectedCallback();
    this.draw();
  }

  private draw = () => {
    requestAnimationFrame(this.draw);
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return html`<main>${this.renderer.domElement}</main>`;
  }
}
