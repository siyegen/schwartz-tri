(function() {
  var Game, Triangle;

  Game = (function() {

    function Game() {
      this.canvas = $('#black')[0];
      this.gl = this.canvas.getContext('experimental-webgl');
      this.vertexShader = "attribute vec2 ppos;\n\nuniform vec2 u_resolution;\n\nvoid main() {\n   // convert the rectangle from pixels to 0.0 to 1.0\n   vec2 zeroToOne = ppos / u_resolution;\n\n   // convert from 0->1 to 0->2\n   vec2 zeroToTwo = zeroToOne * 2.0;\n\n   // convert from 0->2 to -1->+1 (clipspace)\n   vec2 clipSpace = zeroToTwo - 1.0;\n\n   gl_Position = vec4(clipSpace, 0, 1);\n}";
    }

    Game.prototype.init = function() {
      var fshader, program, resolutionLocation, tri, vattrib, vshader;
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
      this.gl.shaderSource(vshader, this.vertexShader);
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
      resolutionLocation = this.gl.getUniformLocation(program, "u_resolution");
      this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
      tri = new Triangle(this.gl, vattrib, {
        width: 50,
        height: 20
      }, this.canvas);
      tri.render();
      return this.gl.flush();
    };

    return Game;

  })();

  Triangle = (function() {

    function Triangle(gl, vattrib, size, canvas) {
      this.gl = gl;
      this.vattrib = vattrib;
      this.size = size;
      this.canvas = canvas;
      this.pos = {
        x: this.canvas.width / 2,
        y: this.canvas.height / 2
      };
      this.triangleVertexBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleVertexBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices()), this.gl.STATIC_DRAW);
      this.gl.vertexAttribPointer(this.vattrib, 2, this.gl.FLOAT, false, 0, 0);
    }

    Triangle.prototype.update = function(pos) {
      this.pos.x = pos.x;
      this.pos.y = pos.y;
      return this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices()), this.gl.STATIC_DRAW);
    };

    Triangle.prototype.vertices = function() {
      var x1, x2, x3, y1, y2, y3;
      x1 = this.pos.x - (this.size.width / 2);
      y1 = this.pos.y - (this.size.height / 2);
      x2 = this.pos.x + (this.size.width / 2);
      y2 = this.pos.y - (this.size.height / 2);
      x3 = this.pos.x;
      y3 = this.pos.y + (this.size.height / 2);
      console.log([x1, y1, x2, y2, x3, y3]);
      return [x1, y1, x2, y2, x3, y3];
    };

    Triangle.prototype.render = function() {
      return this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    };

    return Triangle;

  })();

  $.domReady(function() {
    var game;
    game = new Game;
    return game.init();
  });

}).call(this);
