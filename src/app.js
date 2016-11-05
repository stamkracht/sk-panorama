var camera, scene, renderer, effect;
var skyBox;

init();
render();

function init() {

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000000 );
	controls = new THREE.DeviceOrientationControls( camera );

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x000000, 0 );
	document.body.appendChild( renderer.domElement );

  effect = new THREE.StereoEffect( renderer );
  effect.setSize( window.innerWidth, window.innerHeight );

  var cubeMap = new THREE.CubeTexture( [] );
  cubeMap.format = THREE.RGBFormat;

  var loader = new THREE.ImageLoader();
  loader.load('src/images/skybox.png', function ( image ) {

    var getSide = function ( x, y ) {
      var size = 1024;
      var canvas = document.createElement( 'canvas' );
      canvas.width = size;
      canvas.height = size;
      var context = canvas.getContext( '2d' );
      context.drawImage( image, - x * size, - y * size );
      return canvas;
    };

    cubeMap.images[ 0 ] = getSide( 2, 1 ); // px
    cubeMap.images[ 1 ] = getSide( 0, 1 ); // nx
    cubeMap.images[ 2 ] = getSide( 1, 0 ); // py
    cubeMap.images[ 3 ] = getSide( 1, 2 ); // ny
    cubeMap.images[ 4 ] = getSide( 1, 1 ); // pz
    cubeMap.images[ 5 ] = getSide( 3, 1 ); // nz
    cubeMap.needsUpdate = true;
  });

  var cubeShader = THREE.ShaderLib[ 'cube' ];
  cubeShader.uniforms[ 'tCube' ].value = cubeMap;

  var skyBoxMaterial = new THREE.ShaderMaterial({
    fragmentShader: cubeShader.fragmentShader,
    vertexShader: cubeShader.vertexShader,
    uniforms: cubeShader.uniforms,
    side: THREE.BackSide,
    depthWrite: false,
  });

  skyBox = new THREE.Mesh(
    new THREE.BoxGeometry( 1000000, 1000000, 1000000 ),
    skyBoxMaterial
  );

  scene.add( skyBox );

  //

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	effect.setSize( window.innerWidth, window.innerHeight );

}

function render() {

	requestAnimationFrame( render );

	controls.update();
	effect.render( scene, camera );

}
