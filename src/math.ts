import * as THREE from 'three';
import {
    Direction,
    GRID_HEIGHT,
    GRID_WIDTH,
    TILE_HEIGHT,
    TILE_WIDTH
} from './constants';

export function apply_transforms(
    x: number,
    y: number,
    rot: number
): [number, number, number] {
    // Center grid on the origin
    let cx = x - GRID_WIDTH;
    let cy = y - GRID_HEIGHT;

    // Rotate around new origin
    let cos_rot = Math.cos(rot);
    let sin_rot = Math.sin(rot);
    let rx = (cx * cos_rot) - (cy * sin_rot);
    let ry = (cx * sin_rot) + (cy * cos_rot);

    // Scale and rotate one last time to get into iso view.
    // NOTE: Since a rotation of 45 degrees makes it so sin = cos = 0.707, I
    // factor out the value since all it's doing is scaling the grid down.
    let px = (rx - ry) * TILE_WIDTH / 2;
    let py = (rx + ry) * TILE_HEIGHT / 2;
    let pz = -(rx + ry);

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