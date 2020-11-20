"use strict";

/**
 * Create and compile a shader
 * @param {WebGLRenderingContext} gl
 * @param {Number} type 
 * @param {string} source 
 */
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success){
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

/**
 * Create a program and link its shaders
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader 
 * @param {WebGLShader} fragmentShader 
 */
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

/**
 * Resize the canvas to display size.
 * @param {HTMLCanvasElement} canvas 
 * @param {Number} multiplier 
 */
function resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1;
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {
      canvas.width  = width;
      canvas.height = height;
      return true;
    }
    return false;
  }

  /**
   * Get the shader source code by filename using AJAX
   * @param {string} filename 
   */
function getShaderSource(filename) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET", filename, false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

/**
 * Initialize the program
 * @param {WebGLRenderingContext} gl 
 * @param {string} src_vs The source of vertex shader
 * @param {string} src_fs The source of fragment shader
 * @returns {WebGLProgram}
 */
function programInit(gl, src_vs, src_fs) {
    var vertexShaderSource = getShaderSource(src_vs);
    var fragmentShaderSource = getShaderSource(src_fs);

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    var program = createProgram(gl, vertexShader, fragmentShader);

    return program;
}

/**
 * Get the WebGL rendering contex of the canvas, 
 * the canvas element must have the 'id' property that id = canvas
 * @returns {WebGLRenderingContext} 
 */
function contexInit() {
    let canvas = document.querySelector("#canvas");
    let gl = WebGLRenderingContext.prototype;
    gl = canvas.getContext("webgl");
    return gl;
}