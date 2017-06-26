import { Scene, PerspectiveCamera, WebGLRenderer, Clock } from 'three';
import TWEEN from '@tweenjs/tween.js';
import { qs, $on } from './helpers';
import { trackOriginalOpacities } from './three.animation';


/**
* Creates a new SceneManager instance
*
* @constructor
*/
export default function SceneManager(selector = '#ThreeJS') {
	this.container = qs(selector);
	this.scene = new Scene();
	this.updates = [];
}

/**
* Creates a new THREE scene
*
* @param {function} [callback] The callback to fire after the model is created
*/
SceneManager.prototype.create = function (callback = () => {}) {

	const SCREEN_WIDTH = this.container.offsetWidth;
	const SCREEN_HEIGHT = this.container.offsetHeight;
	const VIEW_ANGLE = 45;
	const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
	const NEAR = 0.1;
	const FAR = 10000;

	this.camera = new PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	this.camera.updateProjectionMatrix();
	this.camera.position.set(0, 0, 10);
	this.scene.add(this.camera);

	this.clock = new Clock();

	this.renderer = new WebGLRenderer({ alpha: true, antialias: window.devicePixelRatio });

	this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
	this.renderer.sortObjects = true;
	this.container.appendChild(this.renderer.domElement);

	$on(window, 'resize', this.onresize);

	this.render();

	callback();

};

SceneManager.prototype.render = function () {

	requestAnimationFrame(this.render.bind(this));

	const delta = this.clock.getDelta();

	// individual object updates
	for (var i = 0; i < this.updates.length; i += 1) {
		this.updates[i].fn(delta);
	}

	TWEEN.update();

	this.renderer.render(this.scene, this.camera);

};

SceneManager.prototype.onresize = function () {

	const SCREEN_WIDTH = this.container.offsetWidth;
	const SCREEN_HEIGHT = this.container.offsetHeight;

	this.camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

	this.camera.updateProjectionMatrix();

	this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

};

SceneManager.prototype.add = function (obj) {

	if (obj.update) {
		this.addUpdate(obj.update, obj.uuid);
	}

	if (obj.constructor.name === 'Mesh') {
		trackOriginalOpacities(obj);
	}

	this.scene.add(obj);

};

SceneManager.prototype.remove = function (obj) {

	this.removeUpdate(obj.uuid);
	this.scene.remove(obj);

};

SceneManager.prototype.addUpdate = function (fn, id) {

	this.updates.push({ fn, id });

};

SceneManager.prototype.removeUpdate = function (id) {

	for (var i = 0; i < this.updates.length; i += 1) {
		if (this.updates[i].id === id) {
			this.updates.splice(i, 1); // remove it
			break;
		}
	}

};
