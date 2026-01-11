const canvas = document.getElementById("show");
SimpleCubes.start(canvas);

SimpleCubes.background("#88aaff");

let cube = SimpleCubes.createCube({
    x: 0, y: 0, z: 0,
    width: 2, height: 2, length: 2,
    color: "#ffffff",
    physics: false
});

let cube2 = SimpleCubes.createCube({
    x: 10, y: 0, z: 0,
    width: 2, height: 2, length: 2,
    color: "#444444",
    physics: true,
    onClick() {
        cube2.setColor("#ffffff")
    },
    model: "assets/tinker.obj",
    mtl: "assets/obj.mtl"
});

cube.setTexture("assets/crate.png")
cube2.setOpacity(0.5)

function loop() {
    if (SimpleCubes.keyPressed("w")) {
        cube.velocityZ = -0.1;
    } else if (SimpleCubes.keyPressed("s")) {
        cube.velocityZ = 0.1;
    } else {
        cube.velocityZ = 0;
    }
    if (SimpleCubes.keyPressed("a")) {
        cube.velocityX = -0.1;
    } else if (SimpleCubes.keyPressed("d")) {
        cube.velocityX = 0.1;
    } else {
        cube.velocityX = 0;
    }
    if (SimpleCubes.keyPressed("Shift")) {
        cube.velocityY = -0.1;
    } else if (SimpleCubes.keyPressed(" ")) {
        cube.velocityY = 0.1;
    } else {
        cube.velocityY = 0;
    }

    if (SimpleCubes.isTouching(cube, cube2)) {
        cube2.setColor("#55ff55");
    } else {
        cube2.setColor("#444444");
    }

    SimpleCubes.camera.position([cube.position.x, cube.position.y + 2, cube.position.z + 8])
    SimpleCubes.camera.rotation([-20, 0, 0])

    requestAnimationFrame(loop);
}
loop();