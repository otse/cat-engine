declare type vec4 = [number, number, number, number];
declare type vec3 = [number, number, number];
declare type vec2 = [number, number];
declare type vec2s = [string, string];

declare var THREE: any;
declare var perlin: any;
declare var noise: any;
declare var BufferGeometryUtils: any;

declare class world_manager {}
declare class game_object {}

type typez = 'direct' | 'tile' | 'tile 3d' | 'wall' | 'wall 3d' | 'ply' | 'light'

interface game_object_literal {
	_type?: typez
	_wpos: vec3
	_r?: number
	colorOverride?: string
	name?: string
	extra?: extra_t
	lonely?: boolean
}

interface extra_t {
	staggerData?
}
