import React, { Component } from 'react';
import { Vector3, BasicMeshMaterial, Raycaster } from 'three';

import { $on } from '../../js/helpers';
import SceneManager from '../../js/sceneManager';
import { animateVector3, fade } from '../../js/three.animation';
import { loadModel, getModel } from '../../js/three.loader';
import { hLight, dLight, makeCube, makeSphere } from '../../js/three.helpers';

import css from './styles.scss';

class Three extends Component {

  componentDidMount() {

    $on(window, 'load', () => {

      const sceneManager = new SceneManager();

      this.sceneManager = sceneManager;

      sceneManager.create();

      sceneManager.add(hLight());
      sceneManager.add(dLight());

      const cube = makeCube();
      const sphere = makeSphere();

      cube.position.x = -10;
      sphere.position.set(25, 2, -3);

      cube.update = rotate.bind(cube);
      sphere.update = rotate.bind(sphere);

      function rotate(delta) {
        this.rotation.x += 0.1 * delta;
        this.rotation.y += 0.1 * delta;
        this.rotation.z += 0.1 * delta;
      }

      sceneManager.add(cube);
      sceneManager.add(sphere);

      animate(cube, 10, 25000);
      animate(sphere, -25, 40000);

      function animate(obj, x, time) {
        animateVector3(obj.position, new Vector3(x, obj.position.y, obj.position.z), {
          duration: time, yoyo: true, repeat: Infinity
        });
      }

      // fade example
      let way = 'in';
      setInterval(() => {
        fade(cube, way, { duration: 5000 });
        fade(sphere, way, { duration: 5000 });
        way = way === 'in'
          ? 'out'
          : 'in';
      }, 10000);

    });

  }

  render() {
    return <div id="ThreeJS" className="three-container" />;
  }
}

export default Three;
