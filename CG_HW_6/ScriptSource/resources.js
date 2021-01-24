class myProgram {
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    constructor(gl) {
        let currentProgram = programInit(gl, "./ShaderSource/Bezier.vs", "./ShaderSource/Bezier.fs");
        this.program = currentProgram;
        this.attributeLocation = {
            vertexPosition: gl.getAttribLocation(currentProgram, "a_position"),
        };
        this.uniformLocation = {
            projectionMatrix: gl.getUniformLocation(currentProgram, "u_PMatrix"),
        };
    }
}

class myBuffers {
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    constructor(gl) {
        let myArr = new myArray();

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(myArr.position),
            gl.STATIC_DRAW
        );

        this.position = positionBuffer;
        this.vertexCount = myArr.position.length / 2;
    }
}