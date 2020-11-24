let timeBase = 0;

function main(mode) {
    let gl = contexInit();
    if (!gl) {
        alert('Unable to initialize WebGL Rendering Context');
        return;
    }

    const programInfo = new myProgram(gl);
    const buffers = new myBuffers(gl);

    let time = new Date();
    let m = time.getMinutes();
    let s = time.getSeconds();
    let ms = time.getMilliseconds();
    timeBase = m * 60 + s + ms * 0.001;

    let then = 0;

    function render(now) {
        now *= 0.001;
        const deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, deltaTime, mode);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}