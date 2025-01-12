declare type vec4 = [number, number, number, number];
declare type vec3 = [number, number, number];
declare type vec2 = [number, number];

declare var THREE: any;

type typez = 'dud' | 'direct' | 'tile' | 'wall' | 'ply'

interface bobj_literal {
	_type: typez
	_wpos: vec3,
	_r?: number,
	name?: string,
	extra?: any
}

declare class bobj {z; constructor(literal)}
