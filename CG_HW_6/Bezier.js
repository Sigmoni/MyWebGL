function main() {
    let gl = contexInit();
    if (!gl) {
        alert('Unable to initialize WebGL Rendering Context');
        return;
    }

    const programInfo = new myProgram(gl);
    const buffers = new myBuffers(gl);

    drawScene(gl, programInfo, buffers);
}