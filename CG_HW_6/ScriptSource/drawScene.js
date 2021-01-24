/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {myProgram} programInfo 
 * @param {myBuffers} buffers 
 */
function drawScene(gl, programInfo, buffers) {
    resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    const fovy = 45;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100;
    //const projectionMatrix = mat4.create.fromIdentity();
    const projectionMatrix = mat4.create.fromPerspective(fovy, aspect, zNear, zFar);
    mat4.lookAt(
        projectionMatrix,
        [0, 0, 3],
        [0, 0, 0],
        [0, 1, 0]
    );
    mat4.matrixReady(projectionMatrix);

    {
        const numComponent = 2;
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

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
        programInfo.uniformLocation.projectionMatrix,
        false,
        projectionMatrix
    );

    {
        const vertexCount = buffers.vertexCount;
        const offset = 0;
        gl.drawArrays(gl.LINE_STRIP, offset, vertexCount);
    }
}