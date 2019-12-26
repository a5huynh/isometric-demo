import * as THREE from 'three';
import { apply_transforms } from '../math';

export function init_scene(
    map: Record<number, THREE.MeshBasicMaterial>,
    grid: Array<Array<number>>
): THREE.Object3D {

    let container = new THREE.Object3D();
    let geometry = new THREE.PlaneGeometry( 32, 32 );

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            let tile = new THREE.Mesh(
                geometry,
                map[grid[y][x]]
            );

            let [px, py, pz] = apply_transforms(x, y, 0);
            // Save the original x/y so we can rotate this later on.
            tile.userData = { x, y };
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