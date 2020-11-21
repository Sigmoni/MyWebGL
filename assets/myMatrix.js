const mat3TYPE = Float32Array.prototype;
const mat4TYPE = Float32Array.prototype;
const vec3TYPE = Float32Array.prototype;
const vec4TYPE = Float32Array.prototype;
const pointTYPE = Float32Array.prototype;

class mat3 {
    /**
     * Compute the determinant of a mat3
     * @param {mat3TYPE} matrix 
     * @returns {Number} The answer
     */
    static determinant(matrix) {
        let ans = 0;

        ans += matrix[0] * matrix[4] * matrix[8];
        ans += matrix[1] * matrix[5] * matrix[6];
        ans += matrix[2] * matrix[3] * matrix[7];
        ans -= matrix[0] * matrix[5] * matrix[7];
        ans -= matrix[1] * matrix[3] * matrix[8];
        ans -= matrix[2] * matrix[4] * matrix[6];

        return ans;
    }
}

class mat4 {
    constructor() { }

    static create = {
        /**
         * Load a new identity matrix
         * @returns {mat4TYPE} An identity matrix
         */
        fromIdentity: function() {
            let out = new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]);
            return out;
        },
        /**
         * Create a matrix by appointing values to each element.
         * @param {Number} m00 
         * @param {Number} m01 
         * @param {Number} m02 
         * @param {Number} m03 
         * @param {Number} m10 
         * @param {Number} m11 
         * @param {Number} m12 
         * @param {Number} m13 
         * @param {Number} m20 
         * @param {Number} m21 
         * @param {Number} m22 
         * @param {Number} m23 
         * @param {Number} m30 
         * @param {Number} m31 
         * @param {Number} m32 
         * @param {Number} m33
         * @returns {mat4TYPE} The matrix using the parameters above. 
         */
        fromValues: function(m00, m01, m02, m03,
                             m10, m11, m12, m13,
                             m20, m21, m22, m23,
                             m30, m31, m32, m33) {
            let out = new Float32Array([
                m00, m01, m02, m03,
                m10, m11, m12, m13,
                m20, m21, m22, m23,
                m30, m31, m32, m33,
            ]);
            return out;
        },
        /**
         * Create a matrix of translation by the given vec3 
         * @param {vec3TYPE} translateVec 
         * @returns {mat4TYPE} The translation matrix
         */
        fromTranslate: function(translateVec) {
            let out = this.fromIdentity();
            out[3]  = translateVec[0];
            out[7]  = translateVec[1];
            out[11] = translateVec[2];
            return out;
        },
        /**
         * Create a matrix of rotation by the given angle and pivot
         * @param {Number} angle The angle in degrees
         * @param {vec3TYPE} pivot The rotation pivot in right-handed system
         * @returns {mat4TYPE} The rotation matrix
         */
        fromRotate: function(angle, pivot) {
            let rad = Math.PI / 180 * angle;
            let a   = Math.sin(rad);
            let b   = Math.cos(rad);
            let c   = 1 - b;

            vec3.normalize(pivot);
            let rx = pivot[0];
            let ry = pivot[1];
            let rz = pivot[2];

            let out = this.fromIdentity();

            out[0] = b + c * rx * rx;
            out[1] = c * rx * ry - a * rz;
            out[2] = c * rx * rz + a * ry;

            out[4] = c * rx * ry + a * rz;
            out[5] = b + c * ry * ry;
            out[6] = c * ry * rz - a * rx;

            out[8]  = c * rx * rz - a * ry;
            out[9]  = c * ry * rz + a * rx;
            out[10] = b + c * rz * rz;

            return out;
        },
        /**
         * Create a matrix of scaling by the given Scaler.
         * @param {vec3TYPE} Scaler 
         */
        fromScale: function(Scaler) {
            let out = new Float32Array(16);

            out[0]  = Scaler[0];
            out[5]  = Scaler[1];
            out[10] = Scaler[2];
            out[15] = 1;

            return out;
        },
        /**
         * Create a projection matrix using perspective view by giving view volumn defeinition
         * @param {Number} left 
         * @param {Number} right 
         * @param {Number} bottom 
         * @param {Number} top 
         * @param {Number} zNear 
         * @param {Number} zFar 
         * @returns {mat4TYPE} The projection matrix
         */
        fromFrustum: function(left, right, bottom, top, zNear, zFar) {
            let out = new Float32Array(16);

            out[0] = 2 * zNear / (right - left);
            out[2] = (right + left) / (right - left);
            out[5] = 2 * zNear / (top - bottom);
            out[6] = (top + bottom) / (top - bottom);
            out[10] = - (zFar + zNear) / (zFar - zNear);
            out[11] = - 2 * zFar * zNear / (zFar - zNear);
            out[14] = -1;

            return out;
        },
        /**
         * Create a projection matrix using perspective view
         * @param {Number} fovy The Field-of-View along y-axis
         * @param {Number} aspect The aspect ratio 
         * @param {Number} zNear Positive
         * @param {Number} zFar Positive
         * @returns {mat4TYPE} The projection matrix
         */
        fromPerspective: function(fovy, aspect, zNear, zFar) {
            let out = new Float32Array(16);
            let rad = Math.PI / 180 * fovy;
            let c = 1/ Math.tan(rad / 2);

            out[0] = c / aspect;
            out[5] = c;
            out[10] = - (zFar + zNear) / (zFar - zNear);
            out[11] = - 2 * zFar * zNear / (zFar - zNear);
            out[14] = -1;

            return out;
        },
        /**
         * Create a projection matrix using orthogonal view
         * @param {Number} left 
         * @param {Number} right 
         * @param {Number} bottom 
         * @param {Number} top 
         * @param {Number} zNear 
         * @param {Number} zFar 
         */
        fromOrtho: function(left, right, bottom, top, zNear, zFar) {
            let out = new Float32Array(16);

            out[0]  = 2 / (right - left);
            out[3]  = - (right + left) / (right - left);
            out[5]  = 2 / (top - bottom);
            out[7]  = - (top + bottom) / (top - bottom);
            out[10] = 2 / (zFar - zNear);
            out[11] = - (zFar + zNear) / (zFar - zNear);
            out[15] = 1;
            
            return out;
        },
        /**
         * Create a matrix that transforms the global coordinate into camera coordinate
         * @param {pointTYPE} pos The position of the camera
         * @param {pointTYPE} gaze The point that the camera gazing at
         * @param {vec3TYPE} up The view-up vector
         */
        fromCamera: function(pos, gaze, up) {
            let w = vec3.create.fromPointToPoint(pos, gaze);
            vec3.normalize(w);
            vec3.scale(w, -1);

            let u = vec3.cross(up, w);
            vec3.normalize(u);

            let v = vec3.cross(w, u);

            let out = new Float32Array(16);
            out[0]  = u[0];
            out[1]  = v[0];
            out[2]  = w[0];
            out[4]  = u[1];
            out[5]  = v[1];
            out[6]  = w[1];
            out[8]  = u[2];
            out[9]  = v[2];
            out[10] = w[2];
            out[15] = 1;

            let transMat = this.fromTranslate([-pos[0], -pos[1], -pos[2]]);

            mat4.multiplyMatrix(out, out, transMat);

            return out;
        }
    }

    /**
     * Multiplies two mat4
     * @param {mat4TYPE} dst The destination matrix
     * @param {mat4TYPE} a Source mat4 A (the first operand)
     * @param {mat4TYPE} b Source mat4 B (the second operand)
     */
    static multiplyMatrix(dst, a, b) {
        let out = new Float32Array(16);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let tmp = 0;
                for (let k = 0; k < 4; k++){
                    tmp += a[i * 4 + k] * b[k * 4 + j];
                }
                out[i * 4 + j] = tmp;
            }
        }
        this.copy(dst, out);
    }

    /**
     * Multipliy a mat4 and a vec4 
     * @param {vec4TYPE} dst The detination of this operation.
     * @param {mat4TYPE} mat The mat4 
     * @param {vec4TYPE} vec The vec4
     */
    static multiplyVector(dst, mat, vec) {
        let out = new Float32Array(4);

        for (let i = 0; i < 4; i++) {
            for (let j =0; j < 4; j++) {
                out[i] += mat[i * 4 + j] * vec[j];
            }
        }

        vec4.copy(dst, out);
    }

    /**
     * Perform translation on a matrix by giving the translation vector
     * @param {mat4TYPE} matrix 
     * @param {vec3TYPE} translateVec 
     */
    static translate(matrix, translateVec) {
        let translateMat = this.create.fromTranslate(translateVec);

        this.multiplyMatrix(matrix, matrix, translateMat);
    }

    /**
     * Perform rotation on a matrix by giving the angle(in degree) and the pivot
     * @param {mat4Type} matrix 
     * @param {Number} angle 
     * @param {vec3TYPE} pivot 
     */
    static rotate(matrix, angle, pivot) {
        let rotateMat = this.create.fromRotate(angle, pivot);

        this.multiplyMatrix(matrix, matrix, rotateMat);
    }

    /**
     * Perform scaling on a matrix by giving the scaler vector
     * @param {mat4TYPE} matrix 
     * @param {vec3TYPE} scalerVec 
     */
    static scale(matrix, scalerVec) {
        let scaleMat = this.create.fromScale(scalerVec);

        this.multiplyMatrix(matrix, matrix, scaleMat);
    }

    /**
     * Perform camera transformation on a matrix
     * @param {mat4TYPE} matrix 
     * @param {pointTYPE} pos The position of the camera
     * @param {pointTYPE} gaze The point that the camera looking at
     * @param {vec3TYPE} up The up-veiw vector
     */
    static lookAt(matrix, pos, gaze, up) {
        let cameraTransMat = this.create.fromCamera(pos, gaze, up);

        this.multiplyMatrix(matrix, matrix, cameraTransMat);
    }

    /**
     * Perform the perspective projection on a matrix
     * @param {mat4TYPE} matrix 
     * @param {Number} fovy 
     * @param {Number} aspect 
     * @param {Number} zNear 
     * @param {Number} zFar 
     */
    static perspective(matrix, fovy, aspect, zNear, zFar) {
        let projectionMat = this.create.fromPerspective(fovy, aspect, zNear, zFar);

        this.multiplyMatrix(matrix, matrix, projectionMat);
    }

    /**
     * Perform the perspective projection on a matrix by any given view volumn frustum
     * @param {mat4TYPE} matrix 
     * @param {Number} left 
     * @param {Number} right 
     * @param {Number} bottom 
     * @param {Number} top 
     * @param {Number} zNear A positive number, the closest distance to the camera lens 
     * @param {Number} zFar A positive number, the furtherest distance to the camera lens
     */
    static frustum(matrix, left, right, bottom, top, zNear, zFar) {
        let projectionMat = this.create.fromFrustum(left, right, bottom, top, zNear, zFar);

        this.multiplyMatrix(matrix, matrix, projectionMat);
    }

    /**
     * Perform orthogonal projection on a matrix by any given view volumn box
     * @param {mat4TYPE} matrix 
     * @param {Number} left 
     * @param {Number} right 
     * @param {Number} bottom 
     * @param {Number} top 
     * @param {Number} zNear 
     * @param {Number} zFar 
     */
    static ortho(matrix, left, right, bottom, top, zNear, zFar) {
        let projectionMat = this.create.fromOrtho(left, right, bottom, top, zNear, zFar);

        this.multiplyMatrix(matrix, matrix, projectionMat);
    }

    /**
     * Perform the transposition on a matrix
     * @param {mat4TYPE} matrix 
     */
    static transpose(matrix) {
        let out = new Float32Array(16);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                out[i * 4 + j] = matrix[j * 4 + i];
            }
        }

        this.copy(matrix, out);
    }

    /**
     * Compute the algebratic cofactor of a mat4 at <column x, row y> 
     * @param {mat4TYPE} matrix 
     * @param {Number} x 
     * @param {Number} y
     * @returns {Number} The result M(x,y)
     */
    static cofactor(matrix, x, y) {
        let out = new Float32Array(9);
        let cnt = 0;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4;j++) {
                if (i != x && j != y) 
                {
                    out[cnt] = matrix[i * 4 + j];
                    cnt++;
                }
            }
        }

        let sign = (((x + y) % 2) == 0) ? 1 : -1;
        let ans = mat3.determinant(out);
        ans *= sign;

        return ans;
    }

    /**
     * Compute the determinant of a mat4
     * @param {mat4TYPE} matrix 
     * @returns {Number} The result
     */
    static determinant(matrix) {
        let ans = 0;
        for (let i = 0; i < 4; i++) {
            let tmp = matrix[i] * this.cofactor(matrix, 0, i);
            ans += tmp;
        }
        return ans;
    }

    /**
     * Invert a matrix
     * @param {mat4TYPE} matrix 
     */
    static invert(matrix) {
        let out = new Float32Array(16);
        let det = this.determinant(matrix);

        if (det == 0) return null;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                out[i * 4 + j] = this.cofactor(matrix, i, j) / det;
            }
        }

        this.copy(matrix, out);
    }

    /**
     * A faster version of invesion
     * @param {mat4TYPE} matrix 
     */
    static invert_fast(matrix) {
        let a00 = matrix[0],
            a01 = matrix[1],
            a02 = matrix[2],
            a03 = matrix[3];
        let a10 = matrix[4],
            a11 = matrix[5],
            a12 = matrix[6],
            a13 = matrix[7];
        let a20 = matrix[8],
            a21 = matrix[9],
            a22 = matrix[10],
            a23 = matrix[11];
        let a30 = matrix[12],
            a31 = matrix[13],
            a32 = matrix[14],
            a33 = matrix[15];

        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }

        det = 1.0 / det;

        let out = new Float32Array(16);

        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        this.transpose(out);
        this.copy(matrix, out);
    }

    /**
     * Get a matrix ready to pass into the shaders
     * @param {mat4TYPE} matrix 
     */
    static matrixReady(matrix) {
        this.transpose(matrix);
    }

    /**
     * This method copies the contents of Source mat4 to Destination mat4
     * @param {mat4TYPE} dst Destination mat4
     * @param {mat4TYPE} src Source mat4
     */
    static copy(dst, src) {
        for (let i = 0; i < 16; i++) {
            dst[i] = src[i];
        }
    }
}

class vec3 {
    constructor() {}

    static create = {
        /**
         * Create a zero vec3
         * @returns {vec3TYPE} A zero vec3 
         */
        zero: function() {
            let out = new Float32Array(3);
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            return out;
        },
        /**
         * Create a vec3 by appointing values to each element
         * @param {Number} x 
         * @param {Number} y 
         * @param {Number} z 
         * @returns {vec3TYPE} A vec3 using <x, y, z> as coordinates
         */
        fromValues: function(x, y, z) {
            let out = new Float32Array(3);
            out[0] = x;
            out[1] = y;
            out[2] = z;
            return out;
        },
        /**
         * Create a vec3 that starts at A and points to B
         * @param {pointTYPE} A 
         * @param {pointTYPE} B 
         * @returns {vec3TYPE} The vec3 A->B
         */
        fromPointToPoint: function(A, B) {
            let out = new Float32Array(3);
            out[0] = B[0] - A[0];
            out[1] = B[1] - A[1];
            out[2] = B[2] - A[2];

            return out;
        }
    }

    /**
     * Normalize a given vec3
     * @param {vec3TYPE} vector The vec3 to normalize
     */
    static normalize(vector) {
        let len = Math.hypot(vector[0], vector[1], vector[2]);

        if (len == 1) return;

        let scaler = 1 / len;
        vector[0] *= scaler;
        vector[1] *= scaler;
        vector[2] *= scaler;
    }

    /**
     * Performs the operation Cross on two vec3
     * @param {vec3TYPE} a 
     * @param {vec3TYPE} b 
     * @returns {vec3TYPE} The vec3 equals A*B
     */
    static cross(a, b) {
        let out = new Float32Array(3);

        out[0] = a[1] * b[2] - a[2] * b[1];
        out[1] = a[2] * b[0] - a[0] * b[2];
        out[2] = a[0] * b[1] - a[1] * b[0];

        return out;
    }
    
    /**
     * Performs the operation dot on two vec3
     * @param {vec3TYPE} a 
     * @param {vec3TYPE} b 
     * @returns {Number} The result of a.b
     */
    static dot(a, b) {
        let out = 0;

        for (let i = 0; i < 3; i++) out += a[i] * b[i];

        return out;
    }

    /**
     * Perform the scaler multiplication
     * @param {vec3TYPE} vec The vec3
     * @param {Number} scaler The scaler
     */
    static scale(vec, scaler) {
        vec[0] *= scaler;
        vec[1] *= scaler;
        vec[2] *= scaler;
    }

     /**
     * This method copies the contents of Source vec3 to Destination vec3
     * @param {vec3TYPE} dst Destination vec3
     * @param {vec3TYPE} src Source vec3
     */
    static copy(dst, src) {
        for (let i = 0; i < 3; i++) {
            dst[i] = src[i];
        }
    }
}

class vec4 {
    constructor() {}

    static create = {
        /**
         * Create a zero vec4
         * @returns {vec4TYPE} A zero vec4
         */
        zero: function() {
            let out = new Float32Array(4);
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        },
        /**
         * Create a vec4 by appointing values to each element
         * @param {Number} x 
         * @param {Number} y 
         * @param {Number} z 
         * @param {Number} w
         * @returns {vec4TYPE} A vec4 using <x, y, z, w> as coordinates
         */
        fromValues: function(x, y, z, w) {
            let out = new Float32Array(4);
            out[0] = x;
            out[1] = y;
            out[2] = z;
            out[3] = w;

            vec4.standardlize(out);

            return out;
        }
    }

    /**
     * Standardlize a given vec4
     * @param {vec4TYPE} vector The vec4 to standardlize
     */
    static standardlize(vector) {
        if (vector[3] == 0) vector[3] = 1;
        if (vector[3] == 1) return;

        let scaler = 1 / len;
        vector[0] *= scaler;
        vector[1] *= scaler;
        vector[2] *= scaler;
        vector[3] = 1;
    }

     /**
     * This method copies the contents of Source vec4 to Destination vec4
     * @param {vec4TYPE} dst Destination vec4
     * @param {vec4TYPE} src Source vec4
     */
    static copy(dst, src) {
        for (let i = 0; i < 4; i++) {
            dst[i] = src[i];
        }
    }
}