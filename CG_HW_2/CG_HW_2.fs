precision mediump float;

varying vec3 v_normal;

uniform vec3 u_reverselLightDirection;
uniform vec4 u_color;

void main() {
    vec3 normal = normalize(v_normal);

    float light = dot(normal, u_reverselLightDirection);

    gl_FragColor = u_color;
    gl_FragColor.rgb *= light;
}