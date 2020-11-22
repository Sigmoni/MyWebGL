let r = 0;

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {myProgram} programInfo 
 * @param {myBuffers} buffers 
 */
function drawScene(gl, programInfo, buffers, deltaTime) {
    resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

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
        [0.0, 0.0, -6.0]
    );
    mat4.rotate(
        modelViewMatrix,
        r,
        [0, 1, 0]
    );
    mat4.scale(
        modelViewMatrix,
        [1, 1, 1]
    )
    mat4.matrixReady(modelViewMatrix);

    const normalMatrix = mat4.create.fromIdentity();
    mat4.copy(normalMatrix, modelViewMatrix);
    mat4.invert_fast(normalMatrix);
    mat4.transpose(normalMatrix);
    mat4.matrixReady(normalMatrix);

    {
        const numComponent = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attributeLocation.vertexPosition,
            numComponent,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(programInfo.attributeLocation.vertexPosition);
    }

    {
        const numComponent = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
        gl.vertexAttribPointer(
            programInfo.attributeLocation.vertexNormal,
            numComponent,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(programInfo.attributeLocation.vertexNormal);
    }

    {
        const numComponent = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(
            programInfo.attributeLocation.vertexColor,
            numComponent,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(programInfo.attributeLocation.vertexColor);
    }

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
        programInfo.uniformLocation.modelViewMatrix,
        false,
        modelViewMatrix
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocation.projectionMatrix,
        false,
        projectionMatrix
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocation.normalMatrix,
        false,
        normalMatrix
    );

    {
        const vertexCount = buffers.vertexCount;
        const offset = 0;
        gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
    }

    r += deltaTime * 40;
    if (r >= 360) r -= 360;
}