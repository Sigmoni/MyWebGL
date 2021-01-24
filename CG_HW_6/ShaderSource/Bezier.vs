attribute vec2 a_position;

uniform mat4 u_PMatrix;

void main() {
    gl_Position = u_PMatrix * vec4(a_position, 0.0, 1.0);
}