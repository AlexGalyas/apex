import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders'

function compile(gl: WebGLRenderingContext, type: number, source: string) {
	const shader = gl.createShader(type)
	if (!shader) throw new Error('rain: could not create shader')
	gl.shaderSource(shader, source)
	gl.compileShader(shader)
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const log = gl.getShaderInfoLog(shader)
		gl.deleteShader(shader)
		throw new Error(`rain: shader failed to compile — ${log}`)
	}
	return shader
}

/**
 * One full-screen triangle and one fragment shader. Rendered below device
 * resolution on purpose: soft, out-of-focus drops read as lens rain and cost a
 * fraction of the fill rate.
 */
export class RainRenderer {
	private readonly gl: WebGLRenderingContext
	private readonly program: WebGLProgram
	private readonly buffer: WebGLBuffer
	private readonly uniforms: {
		resolution: WebGLUniformLocation | null
		time: WebGLUniformLocation | null
		intensity: WebGLUniformLocation | null
	}

	constructor(private readonly canvas: HTMLCanvasElement) {
		const gl = canvas.getContext('webgl', {
			alpha: true,
			premultipliedAlpha: true,
			antialias: false,
			depth: false,
			stencil: false,
			powerPreference: 'low-power'
		})
		if (!gl) throw new Error('rain: WebGL unavailable')
		this.gl = gl

		const program = gl.createProgram()
		const buffer = gl.createBuffer()
		if (!program || !buffer) throw new Error('rain: could not allocate GL objects')
		gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER))
		gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER))
		gl.linkProgram(program)
		if (!gl.getProgramParameter(program, gl.LINK_STATUS))
			throw new Error(`rain: program failed to link — ${gl.getProgramInfoLog(program)}`)
		this.program = program
		this.buffer = buffer

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
		gl.useProgram(program)
		const position = gl.getAttribLocation(program, 'position')
		gl.enableVertexAttribArray(position)
		gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

		this.uniforms = {
			resolution: gl.getUniformLocation(program, 'uResolution'),
			time: gl.getUniformLocation(program, 'uTime'),
			intensity: gl.getUniformLocation(program, 'uIntensity')
		}
	}

	resize(width: number, height: number) {
		this.canvas.width = Math.max(1, Math.round(width))
		this.canvas.height = Math.max(1, Math.round(height))
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
	}

	render(time: number, intensity: number) {
		const { gl, uniforms } = this
		gl.uniform2f(uniforms.resolution, this.canvas.width, this.canvas.height)
		gl.uniform1f(uniforms.time, time)
		gl.uniform1f(uniforms.intensity, intensity)
		gl.drawArrays(gl.TRIANGLES, 0, 3)
	}

	clear() {
		this.gl.clearColor(0, 0, 0, 0)
		this.gl.clear(this.gl.COLOR_BUFFER_BIT)
	}

	dispose() {
		this.gl.deleteBuffer(this.buffer)
		this.gl.deleteProgram(this.program)
		this.gl.getExtension('WEBGL_lose_context')?.loseContext()
	}
}
