// Starter code from: HelloTriangle.js (c) 2012 matsuda
//*******************************
//*Name: Leo Gomez              *
//*Login: legomez               *
//*SID: 1360609                 *
//*Lab#: 2                      *
//*file: RenderingObject.js     *
//*class: CMPS - 160L           *
//*description:                 *
//*takes in a coor and poly file*
//*so it can render an object.  *
//*******************************
// Vertex shader program
var VSHADER_SOURCE =
  [
  'precision mediump float;',
  'uniform mat4 mWorld;',
  'uniform mat4 mView;',
  'uniform mat4 mProj;',
  '',
  'attribute vec4 a_Position;',
  'void main() {',
  '  gl_Position = mProj * mView * mWorld * a_Position;',
  '}'
  ].join('\n');

// Fragment shader program
var FSHADER_SOURCE =
  [
  'precision mediump float;',
  'uniform vec4 color;',
  'void main() {',
  '  gl_FragColor = color;',
  '}'
  ].join('\n');
  
// Retrieve <canvas> element
var canvas = document.getElementById('webgl');

// Get the rendering context for WebGL
// used a different type of context
// in order to keep the background
// after including more triangles

var gl = WebGLUtils.setupWebGL(canvas, {preserveDrawingBuffer: true});

  
var polyAmount;
var coorAmount;
var polyDetails = new Array();
var coorDetails = new Array();
var coorChecker = false;
var polyChecker = false;
var YMax = 0;
var YMin = 0;
var XMax = 0;
var XMin = 0;
var ZMax = 0;
var ZMin = 0;

function main() 
{
	//separated the code into backgrounds changes
	//and drawing values
	drawBackground();
	
	//grabs the information from the file
	document.getElementById("infile1").addEventListener("change", readFileCoor, false);
	document.getElementById("infile2").addEventListener("change", readFilePoly, false);
	if(polyChecker && coorChecker)
		renderObject();
}

//gets all the new triangle details
//to add to the canvas
function readFileCoor(event)
{
	var file = event.target.files[0];
	var type = '';
	if(file)
	{
		var tmp = file.name.split('.');
		type = tmp.pop();
		coorChecker = true;
	}//if(file)
	if(!file)
	{
		alert("Failed to load file");
	}//if(not file)
		
	//checks to see if its a coor file
	else if(!type.match("coor"))
	{
		alert(file.name + " is not a valid coor file")
	} //else if (not coor)
	else
	{
		var r = new FileReader();
		r.onload = function(e)
		{
			//gets the file
			var allXvalues = new Array();
			var allYvalues = new Array();
			var allZvalues = new Array();
			
			var dummy1 = e.target.result;
			//gets first line from file
			coorAmount = dummy1.substr(0,dummy1.indexOf("\n"));
			var lines = dummy1.split("\n");
			lines.splice(0,1);
			dummy1 = lines.join("\n");
			//gets rid of blank space
			var dummy2 = dummy1.replace(/ /g,",");
			var contents = dummy2.replace(/\n/g,",");
			//splits and reverses the values
			//to pop later
			var temp1 = contents.split(",");
			var temp2 = new Array();
			for(var i = 0;i < temp1.length; i++)
			{
				if(temp1[i])
					temp2.push(temp1[i]);
			}
			var temp3 = new Array();
			for(var i = 0;i<temp2.length;i++)
			{
				if(i%4 != 0)
					temp3.push(temp2[i]);
			}//for loop
			for(var i = 0;i<temp3.length;i++)
			{
				if(i%3 == 0)
					allXvalues.push(temp3[i]);
			}//for loop
			XMax = Math.max(...allXvalues);
			XMin = Math.min(...allXvalues);
			for(var i = 0;i<temp3.length;i++)
			{
				if((i+1)%3 == 0)
					allYvalues.push(temp3[i]);
			}//for loop
			YMax = Math.max(...allYvalues);
			YMin = Math.min(...allYvalues);
			for(var i = 0;i<temp3.length;i++)
			{
				if((i+2)%3 == 0)
					allZvalues.push(temp3[i]);
			}//for loop
			ZMax = Math.max(...allZvalues);
			ZMin = Math.min(...allZvalues);
			
			//gives all the coor stuff(in reverse)
			coorDetails = temp3;
			main();
		}//onload
		r.readAsText(file);
	}//else
}//readFileCoor()

function readFilePoly(event)
{
	var file = event.target.files[0];
	var type = '';
	if(file)
	{
		var tmp = file.name.split('.');
		type = tmp.pop();
		polyChecker = true;
	}//if(file)
		
	if(!file)
	{
		alert("Failed to load file");
	}//if(not file)
	else if(!type.match("poly"))
	{
		alert(file.name + " is not a valid .poly file")
	} //else if (not coor)
	else
	{
		var r = new FileReader();
		r.onload = function(e)
		{
			//gets the file
			var dummy1 = e.target.result;
			//gets first line from file
			polyAmount = dummy1.substr(0,dummy1.indexOf("\n"));
			var lines = dummy1.split("\n");
			lines.splice(0,1);
			dummy1 = lines.join("\n");
			//gets rid of space
			var dummy2 = dummy1.replace(/\n/g,",");
			var dummy3 = dummy2.replace(/ /g,",");
			//splits and reverses the values
			//to pop later
			var temp1 = dummy3.split(",");
			var temp2 = new Array();
			var temp3 = new Array();
			//removes the empty elements
			for(var i = 0;i < temp1.length;i++)
			{
				if(temp1[i])
					temp2.push(temp1[i]);
			}//for loop
			//adds only the numbers
			for(var i = 0;i<temp2.length;i++)
			{
				if(i%4 != 0)
					temp3.push(temp2[i]);
			}//for loop
			
			polyDetails = temp3;
			main();
		}//onload
		r.readAsText(file);	
	}//else(read file)
}//readFilePoly()



function drawBackground()
{
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }//if(no gl)

  // Specify the color for clearing <canvas>
  // changed to turn dark gray
  gl.clearColor(0.75,0.85,0.8,1.0);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
}//drawBackground()

function renderObject()
{
	if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
	}//if(no gl)

	// Write the positions of vertices to a vertex shader
	// Takes into consideration position vertices and color
  
	var n = 3; // The number of vertices
	
	var vertShader = gl.createShader(gl.VERTEX_SHADER);
	var fragShader = gl.createShader(gl.FRAGMENT_SHADER);  
	
	gl.shaderSource(vertShader, VSHADER_SOURCE);
	gl.shaderSource(fragShader, FSHADER_SOURCE);
	
	//check for shader errors
	gl.compileShader(vertShader);
	if(!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)){
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertShader));
		return;
	}
	gl.compileShader(fragShader);
	if(!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)){
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragShader));
		return;
	}
	
	//create program and link shaders
	var program = gl.createProgram();
	gl.attachShader(program, vertShader);
	gl.attachShader(program, fragShader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	
	//catch addtional program errors
	gl.validateProgram(program);
	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}
	
	//this is where i put all of the coor details
	var vertices = coorDetails;
	//console.log("vertices = "+vertices);
  
	//this is where i put all of the poly details
	var polygons = polyDetails;
	//console.log("polygons = "+polygons);
	
	// Create a buffer objects for coor and poly
	//buffer for coor
	var coorVertexBufferObject = gl.createBuffer();
	// Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, coorVertexBufferObject);
	// Write date into the buffer objectz
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),gl.STATIC_DRAW);
	
	//buffer for poly
	var polyIndexBufferObject = gl.createBuffer();
	// Bind the buffer object to target
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polyIndexBufferObject);
	// Write date into the buffer objectz
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(polygons), gl.STATIC_DRAW);
  
	var a_Position = gl.getAttribLocation(program, 'a_Position');
	
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return -1;
	}//if()
	// Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, gl.FALSE, 3*Float32Array.BYTES_PER_ELEMENT, 0);

	// Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);
	if (n < 0) {
		console.log('Failed to set the positions of the vertices');
		return;
	}//if(n<0)
  
	//write the data for the color
	gl.useProgram(program);
	program.color = gl.getUniformLocation(program, 'color');
	gl.uniform4fv(program.color, [1,0,1,1]);
	
	//setting up the maticies for the picture
	var matrixWorldUL = gl.getUniformLocation(program, 'mWorld');
	var matrixViewUL = gl.getUniformLocation(program, 'mView');
	var matrixProjUL = gl.getUniformLocation(program, 'mProj');
	
	var worldMatrix = new Matrix4();
	var viewMatrix = new Matrix4();
	var projMatrix = new Matrix4();
	
	worldMatrix.setIdentity();
	viewMatrix.lookAt(0,0,-3*(Math.max(Math.abs(ZMin),Math.abs(YMin),Math.abs(XMin),ZMax,XMax,YMax)),0,0,0,0,1,0);
	//Matrix4.prototype.dropShadow = function(plane, light) {
	projMatrix.setPerspective(45,canvas.width/canvas.height,1,2000);
	
	gl.uniformMatrix4fv(matrixWorldUL,gl.FALSE, worldMatrix.elements);
	gl.uniformMatrix4fv(matrixViewUL,gl.FALSE, viewMatrix.elements);
	gl.uniformMatrix4fv(matrixProjUL,gl.FALSE, projMatrix.elements);
  
	// Draw the rendered object
	
	var identityMatrix = new Matrix4();
	identityMatrix.setIdentity();
	var angle = 0;
	var loop = function()
	{
		angle = performance.now()/15;
		worldMatrix.setRotate(angle,0,1,0);
		gl.uniformMatrix4fv(matrixWorldUL, gl.FALSE,worldMatrix.elements);
		gl.clearColor(0.75,0.85, 0.8,1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLE_STRIP, polyAmount, gl.UNSIGNED_SHORT, 0);
		
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
	
	
	//gl.drawElements(gl.TRIANGLE_STRIP, polyAmount, gl.UNSIGNED_SHORT, 0);
}//renderObject()
