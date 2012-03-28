timeAtLastFrame = new Date().getTime()
idealTimePerFrame = 1000 / 30
leftover = 0.0
frames = 0

class Game
  constructor: ->
    @canvas = $('#black')[0]
    @gl = @canvas.getContext('experimental-webgl')
    @vertexShader = """
      attribute vec2 ppos;

      uniform vec2 u_resolution;

      void main() {
         // convert the rectangle from pixels to 0.0 to 1.0
         vec2 zeroToOne = ppos / u_resolution;

         // convert from 0->1 to 0->2
         vec2 zeroToTwo = zeroToOne * 2.0;

         // convert from 0->2 to -1->+1 (clipspace)
         vec2 clipSpace = zeroToTwo - 1.0;

         gl_Position = vec4(clipSpace, 0, 1);
      }"""


  init: ->
    @gl.clearColor(0.2, 0.2, 1.0, 1.0)

    fshader = @gl.createShader(@gl.FRAGMENT_SHADER)
    @gl.shaderSource(fshader, 'void main(void) {gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);}')
    @gl.compileShader(fshader)
    if not @gl.getShaderParameter(fshader, @gl.COMPILE_STATUS)
      alert 'Error during frag'
      console.log @gl.getShaderInfoLog(fshader)
      return false

    vshader = @gl.createShader(@gl.VERTEX_SHADER)
    @gl.shaderSource(vshader, @vertexShader)
    @gl.compileShader(vshader)
    if not @gl.getShaderParameter(vshader, @gl.COMPILE_STATUS)
      alert 'Error during vertex'
      console.log @gl.getShaderInfoLog(vshader)
      return false

    program = @gl.createProgram()
    @gl.attachShader(program, fshader)
    @gl.attachShader(program, vshader)
    @gl.linkProgram(program)
    if not @gl.getProgramParameter(program, @gl.LINK_STATUS)
      alert 'Error durning linking'
      console.log 'moo'
      return false

    @gl.validateProgram(program)
    alert 'Error validating' if not @gl.getProgramParameter(program, @gl.VALIDATE_STATUS)
    @gl.useProgram(program)

    vattrib = @gl.getAttribLocation(program, 'ppos')
    alert 'Error during Attr' if vattrib is -1
    @gl.enableVertexAttribArray(vattrib)

    resolutionLocation = @gl.getUniformLocation(program, "u_resolution")
    @gl.uniform2f(resolutionLocation, @canvas.width, @canvas.height)

    tri = @tri = new Triangle(@gl, vattrib, {width: 50,height: 20}, @canvas)
    canvas = @canvas

    @canvas.addEventListener 'mousemove', (event) ->
      tri.update
        x: event.clientX
        y: canvas.height-event.clientY

    @canvas.addEventListener 'mousedown', (event) ->
      alert 'pew pew'

  render: =>
    @gl.clear(@gl.COLOR_BUFFER_BIT | @gl.DEPTH_BUFFER_BIT)
    @tri.render()
    @gl.flush()

  tick: =>
    timeAtThisFrame = new Date().getTime()
    timeSinceLastDoLogic = (timeAtThisFrame - timeAtLastFrame) + leftover
    catchUpFrameCount = Math.floor(timeSinceLastDoLogic / idealTimePerFrame)

    for i in [0..catchUpFrameCount]
      frames++

    @render()

    leftover = timeSinceLastDoLogic - (catchUpFrameCount * idealTimePerFrame)
    timeAtLastFrame = timeAtThisFrame

class Triangle
  constructor: (@gl, @vattrib, @size, @canvas) ->
    @pos =
      x: (@canvas.width / 2)
      y: (@canvas.height / 2)

    @triangleVertexBuffer = @gl.createBuffer()
    @gl.bindBuffer(@gl.ARRAY_BUFFER, @triangleVertexBuffer)
    @gl.bufferData(@gl.ARRAY_BUFFER, new Float32Array(@vertices()), @gl.STATIC_DRAW)
    @gl.vertexAttribPointer(@vattrib, 2, @gl.FLOAT, false, 0, 0)

  update: (pos) ->
    @pos.x = pos.x
    @pos.y = pos.y

    @gl.bufferData(@gl.ARRAY_BUFFER, new Float32Array(@vertices()), @gl.STATIC_DRAW)

  vertices: ->
    x1 = @pos.x - (@size.width / 2)
    y1 = @pos.y - (@size.height / 2)
    x2 = @pos.x + (@size.width / 2)
    y2 = @pos.y - (@size.height / 2)
    x3 = @pos.x
    y3 = @pos.y + (@size.height / 2)
    # console.log [x1, y1, x2, y2, x3, y3]
    [x1, y1, x2, y2, x3, y3]

  render: ->
    @gl.drawArrays(@gl.TRIANGLES, 0, 3)

$.domReady ->
  game = new Game
  game.init()

  setInterval game.tick, 1000/30
