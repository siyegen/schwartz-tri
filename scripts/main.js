(function() {

  $.domReady(function() {
    var canvas, fshader, gl, program, triangleVertexBuffer, vattrib, vertices, vshader;
    canvas = $('#black')[0];
    gl = canvas.getContext('experimental-webgl');
    console.log(gl);
    gl.clearColor(0.2, 0.2, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, 'void main(void) {gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);}');
    gl.compileShader(fshader);
    if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
      alert('Error during frag');
      console.log(gl.getShaderInfoLog(fshader));
      false;
    }
    vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, 'attribute vec2 ppos; void main(void) {gl_Position = vec4(ppos.x, ppos.y, 0.0, 1.0);}');
    gl.compileShader(vshader);
    if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
      alert('Error during vertex');
      console.log(gl.getShaderInfoLog(vshader));
      false;
    }
    program = gl.createProgram();
    gl.attachShader(program, fshader);
    gl.attachShader(program, vshader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      alert('Error durning linking');
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
      alert('Error validating');
    }
    gl.useProgram(program);
    vattrib = gl.getAttribLocation(program, 'ppos');
    if (vattrib === -1) alert('Error during Attr');
    gl.enableVertexAttribArray(vattrib);
    vertices = [0.0, 0.5, -0.5, -0.5, 0.5, -0.5];
    triangleVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(vattrib, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return gl.flush();
  });

}).call(this);
