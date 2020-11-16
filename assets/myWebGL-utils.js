"use strict";

function createShader(gl_o, type, source) {
    let gl = WebGLRenderingContext;
    gl = gl_o;

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

function createProgram(gl_o, vertexShader, fragmentShader) {
    let gl = WebGLRenderingContext;
    gl = gl_o;

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

function getShaderSource(filename) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET", filename, false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

function programInit(gl_o, src_vs, src_fs) {
    var gl = WebGLRenderingContext;
    gl = gl_o;

    var vertexShaderSource = getShaderSource(src_vs);
    var fragmentShaderSource = getShaderSource(src_fs);

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    var program = createProgram(gl, vertexShader, fragmentShader);

    return program;
}

function contexInit() {
    let canvas = document.querySelector("#canvas");
    let gl = WebGLRenderingContext;
    gl = canvas.getContext("webgl");
    return gl;
}