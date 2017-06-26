# React + Three.js Boilerplate

Dive straight into building Three.js projects using ES6 and React for overlaying UI.

> NOTE: This boilerplate isn't trying to build a wrapper around Three.js. The aim is too allow anyone to quickly get into making three.js projects using ES6 and React.

## Technologies

- React
- Three.js
- TWEEN
- ES6, Webpack, SCSS, Airbnb lint, Karma

## Quick Overview

```sh
git clone https://github.com/lachlantweedie/react-threejs-es6-boilerplate.git my-new-project

yarn install
npm start
```

Then open [http://localhost:8080/](http://localhost:8080/) to see your app.<br>
When you’re ready to deploy to production, create a minified bundle with `npm run build:prod`.

### Get Started Immediately

You **don’t** need to install or configure tools like Webpack or Babel.<br>
They are preconfigured and hidden so that you can focus on the code.

Just clone the project, and you’re good to go.

## User Guide

- Philosophy
- SceneManager
    - Creating a scene
    - Adding an object
    - Update loop
    - Removing an object
    - Adding/removing custom update methods
- Animation
    - Vectors (position, rotation)
    - Opacity
- Helpers

## Philosophy

Since most Three.js examples you come across will be in es2015 it's easier to translate those examples to ES6 rather than React components.

Think of the Three.jsx as your main three app script that contains initialisation and event listeners. We want to make this as simple as possible to let others understand what's happening in your app. That's why we extract all the more complicated functions into their own files.


## SceneManager

SceneManager aims to simplify the amount of code you need to initialise a three scene in your component code.

### Creating a scene

Creating a three scene as simple as two lines of code.

```javascript
const sceneManager = new SceneManager();
sceneManager.create();
```

This initialises the three.js scene with default variables and starts the render loop.<br>
This if the function to look for if you'd like to change things like camera type or renderer values.

### Adding an object

```javascript
const cube = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({
        wireframe: true,
        color: 0x000000 * Math.random()
    })
);

sceneManager.add(cube);
```

### Update loop

Every time an object is added to the render loop via the sceneManager, sceneManager checks whether to add and update function into the update loop.

This makes sure all update methods are managed in one place and are executed within the render loop for efficiency.

```javascript
// generic rotate function that could be applied to any object
function rotate(delta) {
  this.rotation.x += 0.1 * delta;
  this.rotation.y += 0.1 * delta;
  this.rotation.z += 0.1 * delta;
}

// bind this to cube
cube.update = rotate.bind(cube);

```

### Removing an object

Removing an object also checks to remove the update method from the update loop.

```javascript
sceneManager.remove(cube);
```

### Adding/removing custom update methods

#### Adding

```javascript
sceneManager.addUpdate((delta) => {
    cube.position.x += 0.1 * delta;
}, 'customMoveCube');
```

#### Removing

```javascript
sceneManager.removeUpdate('customMoveCube');
```

## Animation

The TWEEN animation library is used in this boilerplate because it animates within the render loop and is the best for efficiency.

### Vectors (position, rotation)

```javascript
import { animateVector3 } from '../../js/three.animation';

...

animateVector3(cube.position, new Vector3(0, 10, 0), {
  duration: 5000,
  easing: Easing.Linear.None;
  yoyo: true,
  repeat: Infinity,
  delay: 0
});
```

> Remember to import { Easing } from '@tweenjs/tween.js' when modifying easing values.

### Opacity

The fade function from three.helpers fades 'in' or 'out' from 0 to 1.

```javascript
fade(cube, 'in', { duration: 5000 });
```

### Helpers

All helper files are located in `src/js/`.

Complicated or repetitive logic should be extracted into these files to keep logic within the `Three.jsx` component straightforward and readable.
