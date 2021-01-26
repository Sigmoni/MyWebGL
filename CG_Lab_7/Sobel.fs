precision mediump float;

uniform sampler2D u_image;
uniform vec2 u_textureSize;
uniform float u_Sobel1[9];
uniform float u_Sobel2[9];

varying vec2 v_texCoord;

void main(){
    vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
    vec4 colorSumx = 
        texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_Sobel1[0] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_Sobel1[1] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_Sobel1[2] +
        texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_Sobel1[3] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_Sobel1[4] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_Sobel1[5] +
        texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_Sobel1[6] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_Sobel1[7] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_Sobel1[8];
    float luma_x = 0.2126 * colorSumx.r + 0.7152 * colorSumx.g + 0.0722 * colorSumx.b;

    vec4 colorSumy = 
        texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_Sobel2[0] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_Sobel2[1] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_Sobel2[2] +
        texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_Sobel2[3] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_Sobel2[4] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_Sobel2[5] +
        texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_Sobel2[6] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_Sobel2[7] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_Sobel2[8];
    float luma_y = 0.2126 * colorSumy.r + 0.7152 * colorSumy.g + 0.0722 * colorSumy.b;

    float luma = luma_x * luma_x + luma_y * luma_y;

    if (luma > 0.2) gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    else gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}