"use strict"

class myArray{
    constructor() {
        let resolution = 1000;
        let delta_t = 1.0 / resolution;
        let p1 = [0, 1];
        let p2 = [1, 1];
        let p3 = [1, 0];

        let wx = [p1[0], p2[0], p3[0]];
        let wy = [p1[1], p2[1], p3[1]];
        let r  = [1, (Math.SQRT2 - 1) / (2 - Math.SQRT2), 1];

        this.position = [];

        let t = 0;
        for (let i = 0; i < resolution; i++){
            let p = Bezier.RationalBezier(t, wx, wy, r);
            this.position.push(p[0], p[1]);
            t += delta_t;
        }

        this.position.push(1.0, 1.0, 0.0, 1.0);
    }
}

class Bezier{
    /**
    * 
    * @param {number} t The variable
    * @param {Float32Array} wx The weight given by control points
    * @param {Float32Array} wy The weight given by control points
    * @param {Float32Array} r Ratio used to generate Rational Bezier point
    * 
    * @returns {Float32Array} The Rational Bezire point
    */
    static RationalBezier(t, wx, wy, r) {
       let t2 = t * t;
       let mt = 1 - t;
       let mt2 = mt * mt;
       let f = [
           r[0] * mt2,
           2 * r[1] * mt * t,
           r[2] * t2
       ];

       let basis = f[0] + f[1] + f[2];

       let x = 0;
       for (let i = 0; i < 3; i++) {
           x += f[i] * wx[i];
       }
       x /= basis;

       let y = 0;
       for (let i = 0; i < 3; i++) {
           y += f[i] * wy[i];
       }
       y /= basis;

       return ([x, y]);
   }
}