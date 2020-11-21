let rx = 0.0;
let ry = 0.0;

main();

function main() {
    let gl = contexInit();
    if (!gl) {
        alert('Unable to initialize WebGL!');
        return;
    }

    const programInfo = new programInformation(gl);
    const buffers = new buffersInUse(gl);

    var then = 0;

    function render(now) {
        now *= 0.001;
        const deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, deltaTime);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

/**
 * This object contains the needed information for the program.
 * @param {WebGLRenderingContext} gl
 */
function programInformation(gl) {
    let currentProgram = programInit(gl,"CG_HW_2.vs", "CG_HW_2.fs");
    this.program = currentProgram;
    this.attribLocations = {
        vertexPosition: gl.getAttribLocation(currentProgram, "a_VertPos"),
        vertexColor: gl.getAttribLocation(currentProgram, "a_VertColor"),
        vertexNormal: gl.getAttribLocation(currentProgram, "a_VertNormal"),
    }
    this.uniformLocations = {
        projectionMatrix:  gl.getUniformLocation(currentProgram, 'u_ProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(currentProgram, "u_ModelViewMatrix"),
        normalMatrix: gl.getUniformLocation(currentProgram, "u_NormalMatrix"),
    }
}

/**
 * This object contains the buffer needed.
 * @param {WebGLRenderingContext} gl 
 */
function buffersInUse(gl) {
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,

        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,

        // Right face
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ];

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW
    );

    const verticesNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesNormalBuffer);

    const faceNormals = [
        [ 0.0,  0.0,  1.0],
        [ 0.0,  0.0, -1.0],
        [ 0.0,  1.0,  0.0],
        [ 0.0, -1.0,  0.0],
        [ 1.0,  0.0,  0.0],
        [-1.0,  0.0,  0.0],
    ];

    let vertexNormals = [];

    for (let i = 0; i < faceNormals.length; i++) {
        const n = faceNormals[i];

        vertexNormals = vertexNormals.concat(n, n, n, n);
    }

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertexNormals),
        gl.STATIC_DRAW
    );

    const colorBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    const faceColors = [
        [1.0, 1.0, 1.0, 1.0],
        [1.0, 0.0, 0.0, 1.0],
        [0.0, 1.0, 1.0, 1.0],
        [0.0, 0.0, 1.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [1.0, 0.0, 1.0, 1.0],
    ];

    let colors = [];

    for (let i = 0; i < faceColors.length; i++) {
        const c = faceColors[i];

        colors = colors.concat(c, c, c, c);
    }

    gl.bufferData(
        gl.ARRAY_BUFFER, 
        new Float32Array(colors),
        gl.STATIC_DRAW
    );

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    const indices = [
        0,  1,  2,     0,  2,  3,
        4,  5,  6,     4,  6,  7,
        8,  9,  10,    8,  10, 11,
        12, 13, 14,    12, 14, 15,
        16, 17, 18,    16, 18, 19,
        20, 21, 22,    20, 22, 23,
    ];

    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW
    );

    this.position = positionBuffer;
    this.color = colorBuffer;
    this.index = indexBuffer;
    this.normal = verticesNormalBuffer;
}

/**
 * The function that draws the scene.
 * @param {WebGLRenderingContext} gl 
 * @param {programInformation} programInfo 
 * @param {buffersInUse} buffers 
 * @param {Number} deltaTime
 */
function drawScene(gl, programInfo, buffers, deltaTime) {
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
    mat4.matrixReady(projectionMatrix)

    const modelViewMatrix = mat4.create.fromIdentity();
    mat4.translate(
        modelViewMatrix,
        [-0.0, 0.0, -6.0]
    );
    mat4.rotate(
        modelViewMatrix,
        rx,
        [1, 0, 0]
    );
    mat4.rotate(
        modelViewMatrix,
        ry,
        [0, 1, 0]
    );
    mat4.matrixReady(modelViewMatrix);

    const normalMatrix = mat4.create.fromIdentity();
    mat4.copy(normalMatrix, modelViewMatrix);
    mat4.invert_fast(normalMatrix);
    mat4.transpose(normalMatrix);
    mat4.matrixReady(normalMatrix);

    {
        const numComponents = 3;
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
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexNormal,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexNormal
        );
    }

    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
    
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);

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
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix
    );

    {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    rx += deltaTime * 25;
    ry += deltaTime * 80;

    if (rx > 360) rx -= 360;
    if (ry > 360) ry -= 360;
}