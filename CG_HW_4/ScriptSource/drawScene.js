let r1 = 0;
let r2 = 0;
let r3 = 0;

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {myProgram} programInfo 
 * @param {myBuffers} buffers 
 */
function drawScene(gl, programInfo, buffers, deltaTime, mode) {
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
    const height = zNear * Math.tan(fovy * Math.PI / 360);
    const width = height * aspect;
    const projectionMatrix = mat4.create.fromIdentity();

    switch(mode){
        case 0:
            mat4.frustum(
                projectionMatrix,
                -width,
                width,
                -height,
                height,
                zNear,
                zFar
            );
            break;
        case 1:
            mat4.frustum(
                projectionMatrix,
                0,
                width,
                0,
                height,
                zNear,
                zFar
            );
            break;
        case 2:
            mat4.frustum(
                projectionMatrix,
                0,
                width,
                -height,
                0,
                zNear,
                zFar
            );
            break;
        case 3:
            mat4.frustum(
                projectionMatrix,
                -width,
                0,
                0,
                height,
                zNear,
                zFar
            );
            break;
        case 4:
            mat4.frustum(
                projectionMatrix,
                -width,
                0,
                -height,
                0,
                zNear,
                zFar
            );
            break;
        default: return;
    }
    
    mat4.lookAt(
        projectionMatrix,
        [0, 3, 1],
        [0, 0, -12],
        [0, 1, 0]
    );
    mat4.matrixReady(projectionMatrix)

    const modelViewMatrix = mat4.create.fromIdentity();
    mat4.translate(
        modelViewMatrix,
        [0.0, 0.0, -12.0]
    );
    mat4.rotate(
        modelViewMatrix,
        r1,
        [0, 1, 0]
    );
    mat4.scale(
        modelViewMatrix,
        [3, 3, 3]
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

    const modelViewMatrix2 = mat4.create.fromIdentity();
    mat4.translate(
        modelViewMatrix2,
        [0, 0, -12]
    );
    mat4.rotate(
        modelViewMatrix2,
        r2,
        [0, -1, 0]
    );
    mat4.translate(
        modelViewMatrix2,
        [6, 0, 0]
    );
    mat4.rotate(
        modelViewMatrix2,
        r1 * 2,
        [0, 1, 0]
    );
    mat4.scale(
        modelViewMatrix2,
        [0.75, 0.75, 0.75]
    );
    mat4.matrixReady(modelViewMatrix2);

    const normalMatrix2 = mat4.create.fromIdentity();
    mat4.copy(normalMatrix2, modelViewMatrix2);
    mat4.invert_fast(normalMatrix2);
    mat4.transpose(normalMatrix2);
    mat4.matrixReady(normalMatrix2);

    gl.uniformMatrix4fv(
        programInfo.uniformLocation.modelViewMatrix,
        false,
        modelViewMatrix2
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocation.normalMatrix,
        false,
        normalMatrix2
    );

    {
        const vertexCount = buffers.vertexCount;
        const offset = 0;
        gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
    }

    const modelViewMatrix3 = mat4.create.fromIdentity();
    mat4.translate(
        modelViewMatrix3,
        [0, 0, -12]
    );
    mat4.rotate(
        modelViewMatrix3,
        r2,
        [0, -1, 0]
    );
    mat4.translate(
        modelViewMatrix3,
        [6, 0, 0]
    );
    mat4.rotate(
        modelViewMatrix3,
        r3,
        [0, 1, 0]
    );
    mat4.translate(
        modelViewMatrix3,
        [1.5, 0, 0]
    );
    mat4.rotate(
        modelViewMatrix3,
        r3 * 2,
        [0, 1, 0]
    );
    mat4.scale(
        modelViewMatrix3,
        [0.25, 0.25, 0.25]
    );
    mat4.matrixReady(modelViewMatrix3);

    const normalMatrix3 = mat4.create.fromIdentity();
    mat4.copy(normalMatrix3, modelViewMatrix3);
    mat4.invert_fast(normalMatrix3);
    mat4.transpose(normalMatrix3);
    mat4.matrixReady(normalMatrix3);

    gl.uniformMatrix4fv(
        programInfo.uniformLocation.modelViewMatrix,
        false,
        modelViewMatrix3
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocation.normalMatrix,
        false,
        normalMatrix3
    );

    {
        const vertexCount = buffers.vertexCount;
        const offset = 0;
        gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
    }

    r1 += deltaTime * 40;
    if (r1 >= 360) r1 -= 360;

    r2 += deltaTime * 20;
    if (r2 >= 360) r2 -= 360;

    r3 += deltaTime * 80;
    if (r3 >= 360) r2 -= 360;
}