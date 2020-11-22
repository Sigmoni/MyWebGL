"use strict";

class myArray {
    constructor() {
        let x_resolution = 50;
        let y_resolution = 50;

        let delta_x = 1.0 / x_resolution;
        let delta_y = 1.0 / y_resolution;

        this.position = [];
        this.color = [];
        this.normal = [];

        for (let i = 0; i < x_resolution; i++) {
            for (let j = 0; j < x_resolution; j++) {
                let u1 = i * delta_x;
                let v1 = j * delta_y;
                let u2 = (i + 1) * delta_x;
                let v2 = (j + 1) * delta_y;

                let p1 = new SpherePoint(u1, v1);
                this.position.push(p1.x, p1.y, p1.z);
                this.color.push(p1.x / 2 + 0.5, p1.y / 2 + 0.5, p1.z / 2 + 0.5, 1.0);
                let p2 = new SpherePoint(u2, v1);
                this.position.push(p2.x, p2.y, p2.z);
                this.color.push(p2.x / 2 + 0.5, p2.y / 2 + 0.5, p2.z / 2 + 0.5, 1.0);
                let p3 = new SpherePoint(u1, v2);
                this.position.push(p3.x, p3.y, p3.z);
                this.color.push(p3.x / 2 + 0.5, p3.y / 2 + 0.5, p3.z / 2 + 0.5, 1.0);
                let n1 = vec3.create.fromNormal(
                    [p1.x, p1.y, p1.z],
                    [p2.x, p2.y, p2.z],
                    [p3.x, p3.y, p3.z]
                );
                this.normal.push(n1[0], n1[1], n1[2]);
                this.normal.push(n1[0], n1[1], n1[2]);
                this.normal.push(n1[0], n1[1], n1[2]);

                let p4 = new SpherePoint(u2, v2);
                this.position.push(p2.x, p2.y, p2.z);
                this.color.push(p2.x / 2 + 0.5, p2.y / 2 + 0.5, p2.z / 2 + 0.5, 1.0);
                this.position.push(p4.x, p4.y, p4.z);
                this.color.push(p4.x / 2 + 0.5, p4.y / 2 + 0.5, p4.z / 2 + 0.5, 1.0);
                this.position.push(p3.x, p3.y, p3.z);
                this.color.push(p3.x / 2 + 0.5, p3.y / 2 + 0.5, p3.z / 2 + 0.5, 1.0);
                let n2 = vec3.create.fromNormal(
                    [p2.x, p2.y, p2.z],
                    [p4.x, p4.y, p4.z],
                    [p3.x, p3.y, p3.z]
                );
                this.normal.push(n2[0], n2[1], n2[2]);
                this.normal.push(n2[0], n2[1], n2[2]);
                this.normal.push(n2[0], n2[1], n2[2]);
            }
        }
    }
}

class SpherePoint {
    constructor(u, v) {
        let phi = u * 2 * Math.PI;
        let theta = v * Math.PI;
        let radius = 1;

        this.x = radius * Math.sin(theta) * Math.sin(phi);
        this.y = radius * Math.cos(theta);
        this.z = radius * Math.sin(theta) * Math.cos(phi);
    }
}