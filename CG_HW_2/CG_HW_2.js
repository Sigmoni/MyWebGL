function main() {
    let gl = contexInit();
    if (!gl) {
        alert('Unable to initialize WebGL!');
        return;
    }

    const programInfo = new programInformation(gl);
    const buffers = initBuffers(gl);

    drawScene(gl, programInfo, buffers);
}

/**
 * 
 * @param {WebGLRenderingContext} gl
 */
function programInformation(gl) {
    let currentProgram = programInit(gl,"CG_HW_2.vs", "CG_HW_2.fs");
    this.program = currentProgram;
    this.attribLocations = {
        vertexPosition: gl.getAttribLocation(currentProgram, "a_VertPos"),
    }
    this.uniformLocations = {
        projectionMatrix:  gl.getUniformLocation(currentProgram, 'u_ProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(currentProgram, "u_ModelViewMatrix"),
    }
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 */
function initBuffers(gl) {
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = new Float32Array([
         1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
        -1.0, -1.0,
    ]);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        positions,
        gl.STATIC_DRAW
    );

    return {
        position: positionBuffer,
    };
}

/**
 * The function that draws the scene.
 * @param {WebGLRenderingContext} gl 
 * @param {programInformation} programInfo 
 * @param {{position: WebGLBuffer}} buffers 
 */
function drawScene(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fovy = 45;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100;

    const projectionMatrix = mat4.create.fromIdentity();
    mat4.perspective(
        projectionMatrix,
        fovy,
        aspect,
        zNear,
        zFar
    );
    mat4.transposition(projectionMatrix);

    const modelViewMatrix = mat4.create.fromIdentity();
    mat4.translate(
        modelViewMatrix,
        [-0.0, 0.0, -6.0]
    );
    mat4.scale(
        modelViewMatrix,
        [1, 2, 1]
    );
    mat4.rotate(
        modelViewMatrix,
        45,
        [0, 0, 1]
    );
    mat4.transposition(modelViewMatrix);

    {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition
    );

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    );
    }

    {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}

main();