import * as THREE from 'three';
import { Direction } from '../constants';
import { apply_transforms, TransformOptions } from '../math';

export interface RenderOptions {
    angle: number;
    direction: Direction;
    sprite: boolean;
    transform: TransformOptions
}

let EVEN_TEXTURE = new THREE.MeshBasicMaterial({ color: 0xff0000 });
let ODD_TEXTURE = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

export function init_scene(
    map: Record<number, THREE.MeshBasicMaterial>,
    grid: Array<Array<number>>,
    opts: RenderOptions
): THREE.Object3D {

    let container = new THREE.Object3D();
    let geometry = new THREE.PlaneGeometry( 32, 32 );

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            let tile = new THREE.Mesh(
                geometry,
                map[grid[y][x]]
            );

            let [px, py, pz] = apply_transforms(x, y, opts.angle, opts.transform);
            // Save the original x/y so we can rotate this later on.
            tile.userData = { x, y, sprite: grid[y][x] };
            tile.position.x = px;
            tile.position.y = py;
            tile.position.z = pz;

            container.add(tile);
        }
    }

    // Center grid
    container.position.x -= 5;
    container.position.y -= 5;

    return container;
}

export function update_scene(
    scene: THREE.Object3D,
    map: Record<number, THREE.MeshBasicMaterial>,
    opts: RenderOptions
) {
    scene.children.forEach((child) => {
        const { x, y, sprite } = child.userData;
        const [px, py, pz] = apply_transforms(x, y, opts.angle, opts.transform);

        child.position.x = px;
        child.position.y = py;
        child.position.z = pz;

        if (opts.sprite) {
            (<THREE.Mesh>child).material = map[sprite];
        } else {
            (<THREE.Mesh>child).material = (x + y) % 2 ? EVEN_TEXTURE : ODD_TEXTURE;
        }
    })
}