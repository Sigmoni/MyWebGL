varying highp vec4 v_Color;
varying highp vec3 v_Lighting;

void main() {
    gl_FragColor = vec4(v_Color.rgb * v_Lighting, v_Color.a);
}