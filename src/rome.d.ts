declare type vec4 = [number, number, number, number];
declare type vec3 = [number, number, number];
declare type vec2 = [number, number];

declare var THREE: any;

type typez = 'dud' | 'direct' | 'tile' | 'bettertile' | 'wall' | 'wall 3d' | 'ply'

interface game_object_literal {
	_type?: typez
	_wpos: vec3,
	_r?: number,
	color?: string,
	name?: string,
	extra?: any
}

declare class game_object {}