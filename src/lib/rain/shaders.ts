export const VERTEX_SHADER = /* glsl */ `
attribute vec2 position;
void main() {
	gl_Position = vec4(position, 0.0, 1.0);
}
`

/**
 * Rain on a lens, drawn as a transparent overlay (premultiplied alpha):
 * - falling streaks, slightly slanted, only in some columns;
 * - two layers of beads sitting on the glass: a dark body (alpha only) with a
 *   bright, cool highlight toward the top-left, each fading in and out on its
 *   own cycle so the glass never looks frozen.
 * Everything scales with uIntensity, 0 = dry.
 */
export const FRAGMENT_SHADER = /* glsl */ `
precision mediump float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uIntensity;

float hash(vec2 p) {
	p = fract(p * vec2(123.34, 456.21));
	p += dot(p, p + 45.32);
	return fract(p.x * p.y);
}

float streaks(vec2 uv, float t) {
	vec2 p = uv;
	p.x += p.y * 0.18;
	float columns = 70.0;
	float column = floor(p.x * columns);
	float seed = hash(vec2(column, 3.1));
	if (seed > 0.25 + 0.45 * uIntensity) return 0.0;

	float speed = 1.4 + seed * 1.8;
	float y = fract(p.y * 1.2 + t * speed + seed * 13.0);
	float len = 0.1 + seed * 0.15;
	float tail = smoothstep(0.0, 0.015, y) * smoothstep(len, 0.0, y);
	float x = abs(fract(p.x * columns) - 0.5);
	float core = 1.0 - smoothstep(0.03, 0.12, x);
	return tail * core;
}

// x: how much the bead darkens the glass, y: its highlight.
vec2 beads(vec2 uv, float scale, float t, float density) {
	vec2 grid = uv * scale;
	vec2 id = floor(grid);
	vec2 local = fract(grid) - 0.5;
	float seed = hash(id);
	if (seed > density) return vec2(0.0);

	vec2 centre = (vec2(hash(id + 1.3), hash(id + 2.7)) - 0.5) * 0.55;
	float radius = 0.06 + hash(id + 5.1) * 0.1;
	float life = fract(t * (0.03 + seed * 0.04) + seed * 7.0);
	float fade = smoothstep(0.0, 0.15, life) * smoothstep(1.0, 0.7, life);

	vec2 d = (local - centre) * vec2(1.0, 0.85);
	float dist = length(d);
	float body = smoothstep(radius, radius * 0.8, dist);
	float glint = smoothstep(radius * 0.3, 0.0, length(d - vec2(-0.3, 0.35) * radius));
	float rim = smoothstep(radius, radius * 0.92, dist) - smoothstep(radius * 0.92, radius * 0.75, dist);
	return vec2(body, glint + rim * 0.15) * fade;
}

void main() {
	vec2 uv = gl_FragCoord.xy / uResolution.y;
	float t = uTime;
	float intensity = clamp(uIntensity, 0.0, 1.0);

	float s = streaks(uv, t) * intensity;
	vec2 near = beads(uv, 11.0, t, 0.05 + 0.13 * intensity);
	vec2 far = beads(uv + 0.37, 24.0, t * 1.3, 0.06 + 0.18 * intensity);
	float body = max(near.x, far.x * 0.7) * intensity;
	float glint = (near.y + far.y * 0.6) * intensity;

	vec3 cool = vec3(0.78, 0.93, 1.0);
	vec3 colour = cool * (s * 0.28 + glint * 0.5);
	float alpha = clamp(body * 0.1 + s * 0.2 + glint * 0.3, 0.0, 1.0);
	gl_FragColor = vec4(colour, alpha);
}
`
