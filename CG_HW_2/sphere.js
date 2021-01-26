main();

function main() {
    let gl = contexInit();
    if (!gl) {
        alert('Unable to initialize WebGL Rendering Context');
        return;
    }

    const programInfo = new myProgram(gl);
    const buffers = new myBuffers(gl);

    let then = 0;

    function render(now) {
        now *= 0.001;
        const deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, deltaTime);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}