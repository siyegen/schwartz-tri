(function() {
  var Game;

  Game = (function() {

    function Game() {
      this.canvas = $('#black')[0];
      this.gl = this.canvas.getContext('experimental-webgl');
    }

    Game.prototype.init = function() {
      var fshader, program, triangleVertexBuffer, vattrib, vertices, vshader;
      this.gl.clearColor(0.2, 0.2, 1.0, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      fshader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
      this.gl.shaderSource(fshader, 'void main(void) {gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);}');
      this.gl.compileShader(fshader);
      if (!this.gl.getShaderParameter(fshader, this.gl.COMPILE_STATUS)) {
        alert('Error during frag');
        console.log(this.gl.getShaderInfoLog(fshader));
        return false;
      }
      vshader = this.gl.createShader(this.gl.VERTEX_SHADER);
      this.gl.shaderSource(vshader, 'attribute vec2 ppos; void main(void) {gl_Position = vec4(ppos.x, ppos.y, 0.0, 1.0);}');
      this.gl.compileShader(vshader);
      if (!this.gl.getShaderParameter(vshader, this.gl.COMPILE_STATUS)) {
        alert('Error during vertex');
        console.log(this.gl.getShaderInfoLog(vshader));
        return false;
      }
      program = this.gl.createProgram();
      this.gl.attachShader(program, fshader);
      this.gl.attachShader(program, vshader);
      this.gl.linkProgram(program);
      if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        alert('Error durning linking');
        console.log('moo');
        return false;
      }
      this.gl.validateProgram(program);
      if (!this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS)) {
        alert('Error validating');
      }
      this.gl.useProgram(program);
      vattrib = this.gl.getAttribLocation(program, 'ppos');
      if (vattrib === -1) alert('Error during Attr');
      this.gl.enableVertexAttribArray(vattrib);
      vertices = [0.0, 0.5, -0.5, -0.5, 0.5, -0.5];
      triangleVertexBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, triangleVertexBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(vattrib, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
      return this.gl.flush();
    };

    return Game;

  })();

  $.domReady(function() {
    var game;
    game = new Game;
    return game.init();
  });

}).call(this);
