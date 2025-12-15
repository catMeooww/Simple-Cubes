// SimpleCubes-THREE.js
// requires THREE via <script src="https://cdn.jsdelivr.net/npm/three/build/three.min.js"></script>

window.SimpleCubes = (function () {

  let scene, camera, renderer;
  let cubes = [];
  const keys = {};

  // BASIC ENGINE ------------------------------------------------
  function start(canvas) {
    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(canvas.width, canvas.height);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      75,
      canvas.width / canvas.height,
      0.1,
      1000
    );
    camera.position.set(0, 2, 6);

    animate();
    window.addEventListener("keydown", e => keys[e.key] = true);
    window.addEventListener("keyup", e => keys[e.key] = false);
  }

  function background(color) {
    scene.background = new THREE.Color(color);
  }


  // CUBE FACTORY ----------------------------------------------
  function createCube(opts) {
    const geo = new THREE.BoxGeometry(
      opts.width,
      opts.height,
      opts.length
    );

    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(opts.color || "#ffffff")
    });

    const cube = new THREE.Mesh(geo, material);

    cube.size = {
      x: opts.width,
      y: opts.height,
      z: opts.length
    };

    cube.position.set(opts.x || 0, opts.y || 0, opts.z || 0);

    cube.velocityX = 0;
    cube.velocityY = 0;
    cube.velocityZ = 0;

    cube.physics = opts.physics;

    // ADD METHODS ---------------------------
    cube.rotateX = v => cube.rotation.x += THREE.MathUtils.degToRad(v);
    cube.rotateY = v => cube.rotation.y += THREE.MathUtils.degToRad(v);
    cube.rotateZ = v => cube.rotation.z += THREE.MathUtils.degToRad(v);

    cube.setColor = c => {
      cube.material.color = new THREE.Color(c);
    };

    cube.setOpacity = function (value) {
      this.material.transparent = true;
      this.material.opacity = Math.max(0, Math.min(1, value));
    };

    cube.setTexture = url => {
      const loader = new THREE.TextureLoader();
      loader.load(url, tex => {
        cube.material.map = tex;
        cube.material.needsUpdate = true;
      });
    };

    cubes.push(cube);
    scene.add(cube);
    return cube;
  }


  // CAMERA ------------------------------------------------------
  const cameraControl = {
    follow(target) {
      camera.userData.follow = target;
    },
    lookAt(target) {
      camera.userData.lookAt = target;
    },
    position(pos) {
      camera.position.x = pos[0];
      camera.position.y = pos[1];
      camera.position.z = pos[2];
    },
    rotation(rot) {
      const deg = d => d * Math.PI / 180;
      camera.rotation.x = deg(rot[0]);
      camera.rotation.y = deg(rot[1]);
      camera.rotation.z = deg(rot[2]);
    }
  };


  // INPUT -------------------------------------------------------
  function keyPressed(k) {
    return keys[k] === true;
  }


  // PHYSICS + LOOP ---------------------------------------------
  function overlap(aMin, aMax, bMin, bMax) {
    return aMin < bMax && aMax > bMin;
  }


  function testCollision(a, dt = 1) {

    if (!a.physics) return;

    const ax = a.size.x / 2;
    const ay = a.size.y / 2;
    const az = a.size.z / 2;

    cubes.forEach(b => {
      if (!b.physics || b === a) return;
    });

    // ---------- X ----------
    a.position.x += a.velocityX * dt;

    cubes.forEach(b => {
      if (!b.physics || b === a) return;

      if (
        overlap(a.position.x - ax, a.position.x + ax, b.position.x - b.size.x / 2, b.position.x + b.size.x / 2) &&
        overlap(a.position.y - ay, a.position.y + ay, b.position.y - b.size.y / 2, b.position.y + b.size.y / 2) &&
        overlap(a.position.z - az, a.position.z + az, b.position.z - b.size.z / 2, b.position.z + b.size.z / 2)
      ) {
        a.position.x = a.velocityX > 0
          ? b.position.x - b.size.x / 2 - ax
          : b.position.x + b.size.x / 2 + ax;
        a.velocityX = 0;
      }
    });

    // ---------- Y ----------
    a.position.y += a.velocityY * dt;

    cubes.forEach(b => {
      if (!b.physics || b === a) return;

      if (
        overlap(a.position.x - ax, a.position.x + ax, b.position.x - b.size.x / 2, b.position.x + b.size.x / 2) &&
        overlap(a.position.y - ay, a.position.y + ay, b.position.y - b.size.y / 2, b.position.y + b.size.y / 2) &&
        overlap(a.position.z - az, a.position.z + az, b.position.z - b.size.z / 2, b.position.z + b.size.z / 2)
      ) {
        a.position.y = a.velocityY > 0
          ? b.position.y - b.size.y / 2 - ay
          : b.position.y + b.size.y / 2 + ay;
        a.velocityY = 0;
      }
    });

    // ---------- Z ----------
    a.position.z += a.velocityZ * dt;

    cubes.forEach(b => {
      if (!b.physics || b === a) return;

      if (
        overlap(a.position.x - ax, a.position.x + ax, b.position.x - b.size.x / 2, b.position.x + b.size.x / 2) &&
        overlap(a.position.y - ay, a.position.y + ay, b.position.y - b.size.y / 2, b.position.y + b.size.y / 2) &&
        overlap(a.position.z - az, a.position.z + az, b.position.z - b.size.z / 2, b.position.z + b.size.z / 2)
      ) {
        a.position.z = a.velocityZ > 0
          ? b.position.z - b.size.z / 2 - az
          : b.position.z + b.size.z / 2 + az;
        a.velocityZ = 0;
      }
    });
  }



  function animate() {
    requestAnimationFrame(animate);

    cubes.forEach(c => {
      if (c.physics) {
        testCollision(c)
      } else {
        c.position.x += c.velocityX;
        c.position.y += c.velocityY;
        c.position.z += c.velocityZ;
      }
    });

    // CAMERA FOLLOW
    if (camera.userData.follow) {
      const t = camera.userData.follow.position;
      camera.position.lerp(new THREE.Vector3(
        t.x + 3,
        t.y + 3,
        t.z + 6
      ), 0.1);
      camera.lookAt(t);
    }

    if (camera.userData.lookAt) {
      camera.lookAt(camera.userData.lookAt.position);
    }

    renderer.render(scene, camera);
  }


  // RETURN PUBLIC API
  return {
    start,
    background,
    createCube,
    camera: cameraControl,
    keyPressed
  };

})();
