import { Vector3 } from 'three';
import { Tween, Easing } from '@tweenjs/tween.js';

/**
 * Animates a Vector3 to the target Vector3
 *
 * @param  {[Vector3]} vectorToAnimate 	[The vector3 to apply the animation to]
 * @param  {[Vector3]} target          	[Target Vector3]
 * @param  {[Object]} options         	[The animation options for Tween.js]
 */
export function animateVector3(vectorToAnimate, target, options = {}) {
	options = setOptionDefaults(options);
	tween(vectorToAnimate, { x: target.x, y: target.y, z: target.z }, options);
}

/**
 * Fades an object in or out given the direction
 *
 * @param  {[Mesh]} mesh      [The mesh to fade]
 * @param  {[type]} direction [Whether to fade 'in' or 'out']
 * @param  {[type]} options   [The animation options for Tween.js]
 */
export function fade(mesh, direction = 'in', options = {}) {

	options = setOptionDefaults(options);

    const current = { percentage: direction === 'in' ? 1 : 0 };
	const mats = mesh.material.materials ? mesh.material.materials : [mesh.material];
	const originals = mesh.userData.originalOpacities ? mesh.userData.originalOpacities : [1];
	const { update } = options;

	options.update = () => {
		for (var i = 0; i < mats.length; i += 1) {
			mats[i].opacity = originals[i] * current.percentage;
		}
		if (update) update();
	};

	tween(current, { percentage: direction === 'in' ? 0 : 1 }, options);

}

/**
 * Adds the original opacities of the materials to the object
 * Good idea to put this where you add objects to the scene with the check below.
 *
 * if (obj.constructor.name === 'Mesh') {
 * 		trackOriginalOpacities(obj);
 * }
 *
 * @param  {[type]} mesh [description]
 */
export function trackOriginalOpacities(mesh) {

    const opacities = [];
	const materials = mesh.material.materials ? mesh.material.materials : [mesh.material];

	for (var i = 0; i < materials.length; i += 1) {
         materials[i].transparent = true;
         opacities.push(materials[i].opacity);
    }

    mesh.userData.originalOpacities = opacities;

}


/**
 * Generic tween used for all tweens in Three.js
 *
 * @param  {[Object]} current [The object to apply the animation to]
 * @param  {[type]} targets [The target object for current]
 * @param  {[type]} options [Tween options]
 */
function tween(current, targets, options) {
	const tweenVector3 = new Tween(current)
        .to(targets, options.duration)
        .easing(options.easing)
		.yoyo(options.yoyo)
		.repeat(options.repeat)
		.delay(options.delay)
        .onUpdate((d) => {
            if (options.update) options.update(d);
         })
        .onComplete(() => {
          if (options.callback) options.callback();
        });

    tweenVector3.start();
}

/**
 * Sets the default options for the above tweens
 *
 * @param {[Object]} options - list of options
 */
function setOptionDefaults(options) {
	options.duration = options.duration || 2000;
	options.easing = options.easing || Easing.Linear.None;
	options.yoyo = options.yoyo || false;
	options.repeat = options.repeat || 0;
	options.delay = options.delay || 0;
	return options;
}
