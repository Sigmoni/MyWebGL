attribute highp vec3 a_VertPos;
attribute highp vec3 a_VertNormal;
attribute highp vec4 a_VertColor;

varying highp vec4 v_Color;
varying highp vec3 v_Lighting;

uniform highp mat4 u_ModelViewMatrix;
uniform highp mat4 u_ProjectionMatrix;
uniform highp mat4 u_NormalMatrix;

void main() {
    gl_Position = u_ProjectionMatrix * u_ModelViewMatrix * vec4(a_VertPos, 1.0);
    v_Color = a_VertColor;

    highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);
    highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);
    highp vec3 directionalVector = vec3(0.85, 0.8, 0.75);

    highp vec4 transformedNormal = u_NormalMatrix * vec4(a_VertNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    v_Lighting = ambientLight + (directionalLightColor * directional);
}