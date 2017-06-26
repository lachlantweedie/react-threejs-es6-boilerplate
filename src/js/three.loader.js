import { JSONLoader, MultiMaterial, Mesh, LoadingManager } from 'three';

const cache = [];
const loader = new JSONLoader();

export function loadModel(path, name, callback) {

	loader.load(path, (geometry, materials) => {
		const model = new Mesh(geometry, new MultiMaterial(materials));
		model.name = name;
		cache.push({ name, model });
		if (callback) callback();
	});

}

export function getModel(name) {

	for (var i = 0; i < cache.length; i += 1) {
		if (cache[i].name === name) {
			return cache[i].model;
		}
	}

	return undefined;

}
