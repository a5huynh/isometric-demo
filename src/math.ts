import * as THREE from 'three';
import {
    Direction,
    GRID_HEIGHT,
    GRID_WIDTH,
    TILE_HEIGHT,
    TILE_WIDTH
} from './constants';

export interface TransformOptions {
    center: boolean;
    rotation: boolean;
    isometric: boolean;
    scale: boolean;
}

export function apply_transforms(
    x: number,
    y: number,
    rot: number,
    opts: TransformOptions
): [number, number, number] {
    // Center grid on the origin

    let cx = x;
    let cy = y;
    if (opts.center) {
        cx -= GRID_WIDTH;
        cy -= GRID_HEIGHT;
    }

    // Rotate around new origin
    let cos_rot = Math.cos(rot);
    let sin_rot = Math.sin(rot);

    let rx = cx;
    let ry = cy;
    if (opts.rotation) {
        rx = (cx * cos_rot) - (cy * sin_rot);
        ry = (cx * sin_rot) + (cy * cos_rot);
    }

    // Scale and rotate one last time to get into iso view.
    // NOTE: Since a rotation of 45 degrees makes it so sin = cos = 0.707, I
    // factor out the value since all it's doing is scaling the grid down.
    let px = rx;
    let py = ry;
    let pz = -(rx + ry);

    if (opts.isometric) {
        px = (rx - ry) / 2;
        py = (rx + ry) / 2;
    }

    if (opts.scale) {
        px *= TILE_WIDTH;
        py *= TILE_HEIGHT;
    }

    return [px, py, pz];
}

export function rotate_left(dir: Direction): [Direction, number] {
    if (dir == Direction.NORTH) {
        return [Direction.EAST, Math.PI / 2];
    } else if (dir == Direction.EAST) {
        return [Direction.SOUTH, Math.PI];
    } else if (dir == Direction.SOUTH) {
        return [Direction.WEST, -Math.PI / 2];
    }

    return [Direction.NORTH, 0];
}

export function rotate_right(dir: Direction): [Direction, number] {
    if (dir == Direction.NORTH) {
        return [Direction.WEST, -Math.PI / 2];
    } else if (dir == Direction.WEST) {
        return [Direction.SOUTH, Math.PI];
    } else if (dir == Direction.SOUTH) {
        return [Direction.EAST, Math.PI / 2];
    }

    return [Direction.NORTH, 0];
}