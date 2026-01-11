const canvas = document.getElementById("show");
SimpleCubes.start(canvas);

SimpleCubes.background("#88aaff");

posX = 0;
posY = 0;
posZ = 0;

var cube1;
var cube2;
var cube3;
var cube4;

controlElement1 = "<div id='c1'><label>Cube Color</label><br><br><input id='colorSelect' type='color' value='#ffffff'><br><br><label>Cube Opacity</label><br><br><input id='opacitySelect' type='number' value='100'><br><br><button onclick='changeColor()'>Change Color</button></div>"
controlElement2 = "<div id='c2'><button onclick='texCube()'>Create Texturized Cube</button></div>";
controlElement3 = "<div id='c3'><button onclick='clickerCube()'>Create Clickable Cube</button></div>";
controlElement4 = "<div id='c4'><button onclick='modeledCube()'>Create Modeled Cube</button></div>";

baseplate = SimpleCubes.createCube({
    x: 0, y: -10, z: 0,
    width: 100, height: 2, length: 100,
    color: "#aaaaaa",
    physics: true,
    onClick() {
        if (cube3) {
            cube3.setColor("#aaaaaa");
            document.getElementById("click-bool").innerHTML = "False";
        }
    }
});

baseplate.setTexture("assets/base.png")

function firstCube() {
    document.getElementById("controls").innerHTML = controlElement1 + controlElement2 + controlElement3 + controlElement4;
    cube1 = SimpleCubes.createCube({
        x: -20, y: 0, z: -20,
        width: 2, height: 2, length: 2,
        color: "#ffffff",
        physics: true
    });
    cube1.setOpacity(1);
    console.log("cube created!!!")
    posX = cube1.position.x;
    posY = cube1.position.y + 2;
    posZ = cube1.position.z + 8;
}
function texCube() {
    document.getElementById("c2").innerHTML = "<label>Cube Texture</label><br><br><input type='file' id='image-input' accept='image/*'>";
    cube2 = SimpleCubes.createCube({
        x: -10, y: 0, z: -20,
        width: 2, height: 2, length: 2,
        color: "#ffffff",
        physics: true
    });
    cube2.setTexture("assets/crate.png");
    cubeTextureReceiver();
    console.log("cube created!!!")
    posX = cube2.position.x;
    posY = cube2.position.y + 2;
    posZ = cube2.position.z + 8;
}
function clickerCube() {
    document.getElementById("c3").innerHTML = "<label>Cube Clicked</label><br><br><label id='click-bool'>false</label>";
    cube3 = SimpleCubes.createCube({
        x: 0, y: 0, z: -20,
        width: 2, height: 2, length: 2,
        color: "#aaaaaa",
        physics: true,
        onClick() {
            cube3.setColor("#aaffaa");
            document.getElementById("click-bool").innerHTML = "True";
        }
    });
    console.log("cube created!!!")
    posX = cube3.position.x;
    posY = cube3.position.y + 2;
    posZ = cube3.position.z + 8;
}
function modeledCube() {
    document.getElementById("c4").innerHTML = "<label>Cube Model</label><br><br><button onclick='rotLeft()'>←</button><button onclick='rotRight()'>→</button>";
    cube4 = SimpleCubes.createCube({
        x: 10, y: 0, z: -20,
        width: 2, height: 2, length: 2,
        color: "#ffffff",
        physics: true,
        model: "assets/tinker.obj",
        mtl: "assets/obj.mtl"
    });
    cube4.setOpacity(0.1);
    console.log("cube created!!!")
    posX = cube4.position.x;
    posY = cube4.position.y + 2;
    posZ = cube4.position.z + 8;
}

function changeColor() {
    color = document.getElementById("colorSelect").value;
    opacity = Number(document.getElementById("opacitySelect").value) / 100;
    cube1.setColor(color);
    cube1.setOpacity(opacity);
}

function cubeTextureReceiver() {
    const imageInput = document.getElementById('image-input');

    imageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function (e) {
                cube2.setTexture(e.target.result);
            };

            reader.readAsDataURL(file);
        } else {
            if (file) {
                alert("Invalid Texture for Cube!");
                imageInput.value = "";
            }
        }
    });
}

function rotLeft(){
    cube4.rotate(0,0,10);
}

function rotRight(){
    cube4.rotate(0,0,-10);
}

function loop() {
    if (SimpleCubes.keyPressed("w")) {
        posZ -= 1
    } else if (SimpleCubes.keyPressed("s")) {
        posZ += 1
    }
    if (SimpleCubes.keyPressed("a")) {
        posX -= 1
    } else if (SimpleCubes.keyPressed("d")) {
        posX += 1
    }
    if (SimpleCubes.keyPressed("Shift")) {
        posY -= 1
    } else if (SimpleCubes.keyPressed(" ")) {
        posY += 1
    }

    SimpleCubes.camera.position([posX, posY, posZ])
    SimpleCubes.camera.rotation([-20, 0, 0])

    requestAnimationFrame(loop);
}
loop();