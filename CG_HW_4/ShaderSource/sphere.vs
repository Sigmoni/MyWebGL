precision highp float;

attribute vec3 a_VertPos;
attribute vec3 a_VertNormal;
attribute vec4 a_VertColor;

uniform mat4 u_MVMatrix;
uniform mat4 u_PMatrix;
uniform mat4 u_NMatrix;

varying vec4 v_Color;
varying vec3 v_Lighting;

void main() {
    gl_Position = u_PMatrix * u_MVMatrix * vec4(a_VertPos, 1.0);
    v_Color = a_VertColor;

    vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    vec3 directionalLightColor = vec3(0.8, 0.8, 0.8);
    vec3 directionalVector = vec3(-0.85, -0.8, -0.75);

    vec3 transformedNormal = (u_NMatrix * vec4(a_VertNormal, 1.0)).xyz;
    transformedNormal = normalize(transformedNormal);

    float directional = max(dot(directionalVector, transformedNormal), 0.0);
    v_Lighting = ambientLight + (directionalLightColor * directional);
} 