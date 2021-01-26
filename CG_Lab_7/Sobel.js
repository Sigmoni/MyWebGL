function main() {
    let img = new Image();

    img.src = "wallpaper.jpg";
    img.onload = function() {
        render(img);
    }
}

/**
 * 
 * @param {HTMLImageElement} img 
 */
function render(img) {
    let gl = contexInit();
    if (!gl) {
        alert("Failed to initialize WebGL contex!");
        return;
    }

    let program = programInit(gl, "./Sobel.vs", "./Sobel.fs");

    let positionLocation = gl.getAttribLocation(program, "a_position");
    let texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangle(gl, 0, 0, img.width, img.height);

    let texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
    ]), gl.STATIC_DRAW);

    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    let resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    let textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
    let SobelxLocation = gl.getUniformLocation(program, "u_Sobel1[0]");
    let SobelyLocation = gl.getUniformLocation(program, "u_Sobel2[0]");

    resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    {
        let size = 2;
        let type = gl.FLOAT;
        let normalize = false;
        let stride = 0;
        let offset = 0;
        gl.vertexAttribPointer(
            positionLocation, size, type, normalize, stride, offset
        );
    }

    gl.enableVertexAttribArray(texcoordLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    {
        let size = 2;
        let type = gl.FLOAT;
        let normalize = false;
        let stride = 0;
        let offset = 0;
        gl.vertexAttribPointer(
            texcoordLocation, size, type, normalize, stride, offset
        );
    }

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(textureSizeLocation, img.width, img.height);

    let Sobelx = [
         1,  2,  1,
         0,  0,  0,
        -1, -2, -1,
    ];
    gl.uniform1fv(SobelxLocation, Sobelx);

    let Sobely = [
        1, 0, -1,
        2, 0, -2, 
        1, 0, -1,
    ];
    gl.uniform1fv(SobelyLocation, Sobely);

    {
        let primitiveType = gl.TRIANGLES;
        let offset = 0;
        let count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} width 
 * @param {Number} height 
 */
function setRectangle(gl, x, y, width, height)
{
    let x0 = x;
    let y0 = y;
    let x1 = x + width;
    let y1 = y + height;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x0, y0,
        x1, y0,
        x0, y1,
        x0, y1,
        x1, y0,
        x1, y1,
    ]), gl.STATIC_DRAW);
}
