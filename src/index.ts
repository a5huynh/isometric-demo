import * as THREE from 'three';
import { Direction } from './constants';
import { apply_transforms, rotate_left, rotate_right } from './math';
import { init_tiles } from './tiles';
import { init_scene, RenderOptions, update_scene } from './scene/grid';

const SPRITE_MAP: Record<number, THREE.MeshBasicMaterial> = init_tiles();

let RENDER_OPTIONS: RenderOptions = {
    angle: 0,
    direction: Direction.NORTH,
    sprite: true,
    transform: {
        center: true,
        rotation: true,
        isometric: true,
        scale: true
    }
};

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

let container = init_scene(SPRITE_MAP, grid, RENDER_OPTIONS);
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
document.getElementById('rotate_left')?.addEventListener('click', () => {
    // Rotate the tiles counter-clockwise
    const [new_dir, angle] = rotate_left(RENDER_OPTIONS.direction);
    RENDER_OPTIONS.angle = angle;
    RENDER_OPTIONS.direction = new_dir;
    update_scene(container, SPRITE_MAP, RENDER_OPTIONS);
});

document.getElementById('rotate_right')?.addEventListener('click', () => {
    // Rotate the tiles counter-clockwise
    const [new_dir, angle] = rotate_right(RENDER_OPTIONS.direction);
    RENDER_OPTIONS.angle = angle;
    RENDER_OPTIONS.direction = new_dir;
    update_scene(container, SPRITE_MAP, RENDER_OPTIONS);
});

document.getElementById('toggle_sprite')?.addEventListener('click', (evt) => {
    RENDER_OPTIONS.sprite = !RENDER_OPTIONS.sprite;
    update_scene(container, SPRITE_MAP, RENDER_OPTIONS);
    (<HTMLElement>evt.currentTarget).innerHTML = `sprite: ${RENDER_OPTIONS.sprite}`;
});

document.getElementById('toggle_center')?.addEventListener('click', (evt) => {
    RENDER_OPTIONS.transform.center = !RENDER_OPTIONS.transform.center;
    update_scene(container, SPRITE_MAP, RENDER_OPTIONS);
    (<HTMLElement>evt.currentTarget).innerHTML = `center: ${RENDER_OPTIONS.transform.center}`;
});

document.getElementById('toggle_rot')?.addEventListener('click', (evt) => {
    RENDER_OPTIONS.transform.rotation = !RENDER_OPTIONS.transform.rotation;
    update_scene(container, SPRITE_MAP, RENDER_OPTIONS);
    (<HTMLElement>evt.currentTarget).innerHTML = `rotation: ${RENDER_OPTIONS.transform.rotation}`;
});

document.getElementById('toggle_iso')?.addEventListener('click', (evt) => {
    RENDER_OPTIONS.transform.isometric = !RENDER_OPTIONS.transform.isometric;
    update_scene(container, SPRITE_MAP, RENDER_OPTIONS);
    (<HTMLElement>evt.currentTarget).innerHTML = `isometric: ${RENDER_OPTIONS.transform.isometric}`;
});

document.getElementById('toggle_scale')?.addEventListener('click', (evt) => {
    RENDER_OPTIONS.transform.scale = !RENDER_OPTIONS.transform.scale;
    update_scene(container, SPRITE_MAP, RENDER_OPTIONS);
    (<HTMLElement>evt.currentTarget).innerHTML = `scale: ${RENDER_OPTIONS.transform.scale}`;
});
