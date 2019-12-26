import * as THREE from 'three';

export enum Tile {
    GRASS = 0,
    WATER = 1
};

const SPRITE_MAP: Record<number, string> = {
    [Tile.GRASS]: 'grass.png',
    [Tile.WATER]: 'dirtDouble.png'
};

export function init_tiles(): Record<number, THREE.MeshBasicMaterial> {
    let textures: Record<number, THREE.MeshBasicMaterial> = {};

    for (let key in SPRITE_MAP) {
        let path: string = SPRITE_MAP[key];
        let texture = new THREE.TextureLoader().load(`tiles/${path}`);
        textures[key] = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });
    }

    return textures;
}