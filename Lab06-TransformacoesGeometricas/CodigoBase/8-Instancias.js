// Instancias de objetos.

import * as THREE from 'three';
import { GUI } 		from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js'

const 	rendSize 	= new THREE.Vector2();

var 	gui 		= new GUI();

var 	scene,
		renderer,
		camera,
		controls;

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function main() {

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	rendSize.x = 
	rendSize.y = Math.min(window.innerWidth, window.innerHeight) * 0.8;

	renderer.setSize(rendSize.x, rendSize.y);

	document.body.appendChild(renderer.domElement);

	scene 	= new THREE.Scene();

	camera = new THREE.OrthographicCamera( -50.0, 50.0, 50.0, -50.0, -50.0, 50.0 );
	scene.add( camera );

	// Coloca a iluminação no meio do Sol
	const luz = new THREE.PointLight(0xffffff, 0.8, 500);
	luz.position.set(0, 0, 0)
	scene.add(luz)

	initGUI();

	buildScene();

	renderer.clear();
	requestAnimationFrame(animate);
};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function initGUI() {

	controls = 	{	RotLua 		: true,
					RotTerra 	: true,
					RotTerraLua : true,
					};


};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function buildScene() {

	// Sistema Solar: Sol, Terra e Lua
	// 3 instancias de esferas 

	var SolGeometry = new THREE.SphereGeometry(5, 32, 32);
	var SolMaterial = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('/Assets/Textures/solarSystem/2k-images/2k_sun.jpg')});
	var Sol = new THREE.Mesh(SolGeometry, SolMaterial);
	Sol.name = 'Sol';
	scene.add(Sol);

    // Transformação da Lua em relação à Terra
    var luaTerraTransform = new THREE.Matrix4().makeTranslation(3.0, 0.0, 0.0);

	var sistemaSolar 		= new THREE.InstancedMesh( 	new THREE.SphereGeometry( 1.0, 10, 10), 
														new THREE.MeshPhongMaterial( {wireframe:false} ), 
														10 );
	sistemaSolar.name = "SistemaSolar";

	scene.add(sistemaSolar);

	// Mercurio, Venus, Terra, Lua, Marte, Jupiter, Saturno, Urano e Netuno

	const instanceColors 	= [ 0xffffff,0xE59866, 0xE59866, 0x3498DB, 0xCACFD2, 0xE74C3C, 0xEDBB99, 0xFEF5E7, 0x5DADE2, 0x2874A6 ];

	for (let i = 1 ; i <= 10 ; i++) 
		sistemaSolar.setColorAt ( i, new THREE.Color(instanceColors[i]));
	
	// Sol
	var transfMat = new THREE.Matrix4().makeScale(4.0, 4.0, 4.0);
	//sistemaSolar.setMatrixAt( 0, transfMat );

	// Mercurio
	transfMat.identity();
	transfMat.multiply(new THREE.Matrix4().makeScale(0.3, 0.3, 0.3));
	transfMat.multiply(new THREE.Matrix4().makeTranslation(7.0, 0.0, 0.0));
	sistemaSolar.setMatrixAt( 1, transfMat );

	// Venus
	transfMat.identity();
	transfMat.multiply(new THREE.Matrix4().makeScale(0.3, 0.3, 0.3));
	transfMat.multiply(new THREE.Matrix4().makeTranslation(9.0, 0.0, 0.0));
	sistemaSolar.setMatrixAt( 2, transfMat );

	// Terra
	transfMat.identity();
	transfMat.multiply(new THREE.Matrix4().makeScale(1.5, 1.5, 1.5));
	transfMat.multiply(new THREE.Matrix4().makeTranslation(12.0, 0.0, 0.0));
	sistemaSolar.setMatrixAt( 3, transfMat );

	// Lua
	transfMat.identity();
	transfMat.multiply(new THREE.Matrix4().makeScale(0.2, 0.2, 0.2));
	transfMat.multiply(new THREE.Matrix4().makeTranslation(13.0, 0.0, 0.0));
	sistemaSolar.setMatrixAt( 4, transfMat );

	// Marte
	transfMat.identity();
	transfMat.multiply(new THREE.Matrix4().makeScale(0.5, 0.5, 0.5));
	transfMat.multiply(new THREE.Matrix4().makeTranslation(18.0, 0.0, 0.0));
	sistemaSolar.setMatrixAt( 5, transfMat );

	// Jupiter
	transfMat.identity();
	transfMat.multiply(new THREE.Matrix4().makeTranslation(20.0, 0.0, 0.0));
	transfMat.multiply(new THREE.Matrix4().makeScale(15.5, 15.5, 15.5));
	sistemaSolar.setMatrixAt( 6, transfMat );

	// Saturno
	transfMat.identity();
	transfMat.multiply(new THREE.Matrix4().makeScale(2.0, 2.0, 2.0));
	transfMat.multiply(new THREE.Matrix4().makeTranslation(22.0, 0.0, 0.0));
	sistemaSolar.setMatrixAt( 7, transfMat );

	// Urano
	transfMat.identity();
	transfMat.multiply(new THREE.Matrix4().makeScale(0.5, 0.5, 0.5));
	transfMat.multiply(new THREE.Matrix4().makeTranslation(25.0, 0.0, 0.0));
	sistemaSolar.setMatrixAt( 8, transfMat );

	// Netuno
	transfMat.identity();
	transfMat.multiply(new THREE.Matrix4().makeScale(0.5, 0.5, 0.5));
	transfMat.multiply(new THREE.Matrix4().makeTranslation(28.0, 0.0, 0.0));
	sistemaSolar.setMatrixAt( 9, transfMat );

	sistemaSolar.needsUpdate = true;
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function animate(time) {

	let rotMercurio = 0.004   * time;
	let rotVenus    = 0.003   * time;
	let rotTerra 	= 0.001   * time;	// Rotação da Terra ao redor de seu eixo (Y)
	let rotLua 		= 0.001  * time;	// Rotação da Lua ao redor do seu eixo (Y)
	let rotTerraLua	= 0.005   * time;	// Rotação da Terra e da Lua ao redor do sol (Z)
	let rotMarte    = 0.0015  * time;
	let rotJupiter  = 0.0005  * time;
	let rotSaturno  = 0.0002  * time;
	let rotUrano    = 0.0001  * time;
	let rotNetuno   = 0.00001 * time;

var obj = scene.getObjectByName("SistemaSolar");

   let Sol = scene.getObjectByName("Sol");
   Sol.rotateZ(0.003);

   // Mercurio
   let mercurioRotation = new THREE.Matrix4().makeRotationZ(rotMercurio);
   let mercurioTranslation = new THREE.Matrix4().makeTranslation(7.0, 0.0, 0.0);
   let mercurioTransform = new THREE.Matrix4().multiplyMatrices(mercurioRotation, mercurioTranslation);

   obj.setMatrixAt(1, mercurioTransform);

   // Vênus
   let venusRotation = new THREE.Matrix4().makeRotationZ(rotVenus);
   let venusTranslation = new THREE.Matrix4().makeTranslation(9.0, 0.0, 0.0);
   let venusTransform = new THREE.Matrix4().multiplyMatrices(venusRotation, venusTranslation);

   obj.setMatrixAt(2, venusTransform);

   // Terra
   let terraRotation = new THREE.Matrix4().makeRotationZ(rotTerra);
   let terraTranslation = new THREE.Matrix4().makeTranslation(12.0, 0.0, 0.0);
   let terraTransform = new THREE.Matrix4().multiplyMatrices(terraRotation, terraTranslation);

   obj.setMatrixAt(3, terraTransform);

   // Lua
   let luaRotation = new THREE.Matrix4().makeRotationZ(rotLua);
   let luaTranslation = new THREE.Matrix4().makeTranslation(14.0, 0.0, 0.0);
   let luaTransform = new THREE.Matrix4().multiplyMatrices(terraRotation, luaTranslation);

   obj.setMatrixAt(4, luaTransform);


   // Como controlar o sistema Terra/Lua ?
   //let terraLuaRotation = new THREE.Matrix4().makeRotationZ(rotTerraLua);
   //let terraLuaTranslation = new THREE.Matrix4().makeTranslation(12.0, 0.0, 0.0);
   //let terraLuaTransform = new THREE.Matrix4().multiplyMatrices(terraLuaRotation, terraLuaTranslation);

   //obj.setMatrixAt(5, terraLuaTransform)

   // Marte
   let marteRotation = new THREE.Matrix4().makeRotationZ(rotMarte);
   let marteTranslation = new THREE.Matrix4().makeTranslation(18.0, 0.0, 0.0);
   let marteTransform = new THREE.Matrix4().multiplyMatrices(marteRotation, marteTranslation);

   obj.setMatrixAt(5, marteTransform);

   // Jupiter
   let jupiterRotation = new THREE.Matrix4().makeRotationZ(rotJupiter);
   let jupiterTranslation = new THREE.Matrix4().makeTranslation(20.0, 0.0, 0.0);
   let jupiterTransform = new THREE.Matrix4().multiplyMatrices(jupiterRotation, jupiterTranslation);

   obj.setMatrixAt(6, jupiterTransform);

   // Saturno
   let saturnoRotation = new THREE.Matrix4().makeRotationZ(rotSaturno);
   let saturnoTranslation = new THREE.Matrix4().makeTranslation(22.0, 0.0, 0.0);
   let saturnoTransform = new THREE.Matrix4().multiplyMatrices(saturnoRotation, saturnoTranslation);

   obj.setMatrixAt(7, saturnoTransform);

   // Urano
   let uranoRotation = new THREE.Matrix4().makeRotationZ(rotUrano);
   let uranoTranslation = new THREE.Matrix4().makeTranslation(25.0, 0.0, 0.0);
   let uranoTransform = new THREE.Matrix4().multiplyMatrices(uranoRotation, uranoTranslation);

   obj.setMatrixAt(8, uranoTransform);

   // Netuno
   let netunoRotation = new THREE.Matrix4().makeRotationZ(rotNetuno);
   let netunoTranslation = new THREE.Matrix4().makeTranslation(28.0, 0.0, 0.0);
   let netunoTransform = new THREE.Matrix4().multiplyMatrices(netunoRotation, netunoTranslation);

   obj.setMatrixAt(9, netunoTransform);


	obj.instanceMatrix.needsUpdate = true;

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
