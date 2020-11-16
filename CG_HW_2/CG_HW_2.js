"use strict";

function main() {
    let gl = contexInit();
    if (!gl) {
        return;
    }

    let program = programInit(gl, "CG_HW_2.vs", "CG_HW_2.fs");

    let positionLocation = gl.getAttribLocation(program, "a_position");
    let colorLocation = gl.getUniformLocation(program, "u_color");
    let matrixLocation = gl.getUniformLocation(program, "u_world");

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
}

function setGeomery(gl_o) {
    gl = WebGLRenderingContext;
    gl = gl_o;

    gl.bufferData()
}