attribute vec4 a_VertPos;
attribute vec4 a_VertColor;

varying lowp vec4 v_Color;

uniform mat4 u_ModelViewMatrix;
uniform mat4 u_ProjectionMatrix;

void main() {
    gl_Position = u_ProjectionMatrix * u_ModelViewMatrix * a_VertPos;
    v_Color = a_VertColor;
}