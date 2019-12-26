import * as THREE from 'three';
import { Direction } from './constants';
import { apply_transforms, rotate_left, rotate_right } from './math';
import { init_tiles } from './tiles';
import { init_scene } from './scene/grid';

const SPRITE_MAP: Record<number, THREE.MeshBasicMaterial> = init_tiles();

let CURRENT_DIR: Direction = Direction.NORTH;

// The 10 x 10 grid we're using in the example
let grid: Array<Array<number>> = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // Adding a dirt patch in the corner so we can visualize the
    // rotation.
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let width = window.innerWidth;
let height = window.innerHeight;

function onWindowResize() {
    camera.left = -window.innerWidth / 2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = -window.innerHeight / 2;

    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// The camera is setup such that a single unit length in 3D space
// is equal to a pixel. Thus a 10 x 10 x 10 box is a 10 pixel wide/high/deep box.
let camera = new THREE.OrthographicCamera(
    width / - 2,
    width / 2,
    height / 2,
    height / -2,
    0.1,
    1000
);

let scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );

let container = init_scene(SPRITE_MAP, grid);
scene.add(container);

// NOTE: WebGL uses right handed coordinate system, positive z values go towards
// the viewer.
camera.position.z = 20;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( width, height );
renderer.setPixelRatio( window.devicePixelRatio );
document.body.appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

window.addEventListener( 'resize', onWindowResize, false );
animate();

// Setup button events
let rl_btn = document.getElementById('rotate_left');
rl_btn?.addEventListener('click', () => {
    // Rotate the tiles counter-clockwise
    const [new_dir, angle] = rotate_left(CURRENT_DIR);
    CURRENT_DIR = new_dir;

    container.children.forEach((child) => {
        const { x, y } = child.userData;
        const [px, py, pz] = apply_transforms(x, y, angle);
        child.position.x = px;
        child.position.y = py;
        child.position.z = pz;
    })
});

let rr_btn = document.getElementById('rotate_right');
rr_btn?.addEventListener('click', () => {
    // Rotate the tiles counter-clockwise
    const [new_dir, angle] = rotate_right(CURRENT_DIR);
    CURRENT_DIR = new_dir;

    container.children.forEach((child) => {
        const { x, y } = child.userData;
        const [px, py, pz] = apply_transforms(x, y, angle);
        child.position.x = px;
        child.position.y = py;
        child.position.z = pz;
    })
});