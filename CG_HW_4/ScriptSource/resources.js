class myProgram {
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    constructor(gl) {
        let currentProgram = programInit(gl, "./ShaderSource/sphere.vs", "./ShaderSource/sphere.fs");
        this.program = currentProgram;
        this.attributeLocation = {
            vertexPosition: gl.getAttribLocation(currentProgram, "a_VertPos"),
            vertexColor: gl.getAttribLocation(currentProgram, "a_VertColor"),
            vertexNormal: gl.getAttribLocation(currentProgram, "a_VertNormal"),
        };
        this.uniformLocation = {
            modelViewMatrix: gl.getUniformLocation(currentProgram, "u_MVMatrix"),
            projectionMatrix: gl.getUniformLocation(currentProgram, "u_PMatrix"),
            normalMatrix: gl.getUniformLocation(currentProgram, "u_NMatrix"),
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

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(myArr.color),
            gl.STATIC_DRAW
        );

        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(myArr.normal),
            gl.STATIC_DRAW
        );

        this.position = positionBuffer;
        this.color = colorBuffer;
        this.normal = normalBuffer;
        this.vertexCount = myArr.position.length / 3;
    }
}