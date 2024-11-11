
const canvas = document.getElementById("canv");
const ctx = canvas.getContext("2d");

canvas.width  = window.innerWidth  * 0.999;
canvas.height = window.innerHeight * 0.995;


// HTML Elements
const angleRange = document.getElementById("angleRange");
const ratioRange = document.getElementById("ratioRange");
const scaleRange = document.getElementById("scaleRange");
const iterationsRange = document.getElementById("iterationsRange");

const angleText = document.getElementById("angleText");
const ratioText = document.getElementById("ratioText");
const scaleText = document.getElementById("scaleText");
const iterationsText = document.getElementById("iterationsText");

const themeSelectBox = document.getElementById("themes");
const menu = document.querySelector(".container");
const toggleButton = document.querySelector(".toggle-menu");


// Themes
const YIN_YANG_SCHEME = ["hsl(200, 100%, 20%)", "white", "black"];
const RED_BLUE_SCHEME = ["black", "red", "blue"];
const SINGLE_SCHEME = ["black", "white", "white"];

let antartica = ctx.createLinearGradient(canvas.width/3, 0, canvas.width/3*2, canvas.height);
antartica.addColorStop(0, "#D8B5FF");
antartica.addColorStop(1, "#1EAE98");
const ANTARCTICA_SCHEME = ["black", antartica, antartica]


let colorScheme = ANTARCTICA_SCHEME;


function randRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


function makeLine(x, y, length, angle, dir) {
    return { x, y, length, angle, dir, hasChildren: false };
}

function drawLine(x, y, length, angle, dir) {
    changeX = length * Math.sin(angle * (Math.PI/180));
    changeY = length * Math.cos(angle * (Math.PI/180));

    let endPoint = {
        x: x + changeX,
        y: y + (changeY*dir)
    }

    if (dir == -1) {
        ctx.strokeStyle =  colorScheme[1];
    }
    else if (dir == 1) {
        ctx.strokeStyle =  colorScheme[2];
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.closePath();
    ctx.stroke();

    return endPoint;
}


function runSimulation(scale, iterationCount, lengthCoefficient, angleIncrease) {
    let lines = []
    let newLines = []; // Waiting Room for Lines that will be put into "lines" at the end of the for loop
    
    lines.push(makeLine(canvas.width/2, canvas.height/2, scale, 0, 1));
    lines.push(makeLine(canvas.width/2, canvas.height/2, scale, 0, -1));
    
    
    for (let i = 0; i < iterationCount; i++) {
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
    
            if (!line.hasChildren) {
                
                let endPoint = drawLine(line.x, line.y, line.length, line.angle, line.dir);
    
                newLines.push(makeLine(endPoint.x, endPoint.y, line.length*lengthCoefficient, line.angle+angleIncrease, line.dir));
                newLines.push(makeLine(endPoint.x, endPoint.y, line.length*lengthCoefficient, line.angle-angleIncrease, line.dir));
            }
    
            lines[i].hasChildren = true;
        }
    
        for (let newLine of newLines) {
            lines.push(newLine);
        }
        newLines = [];
    }

    return lines;
}


toggleButton.addEventListener("click", () => {
    if (menu.style.left == "0px") {
        menu.style.left = "-1000px";
        toggleButton.innerText = "O";
    }
    else {
        menu.style.left = "0px";
        toggleButton.innerText = "X";
    }
})


document.addEventListener("keydown", e => {
    switch (e.key) {
        case "a": 
            angleRange.focus();
            break;
        case "s": 
            scaleRange.focus();
            break;
        case "r": 
            ratioRange.focus();
            break;
    }

})


function animate() {
    requestAnimationFrame(animate);

    switch (themeSelectBox.value) {
        case "yyt":
            colorScheme = YIN_YANG_SCHEME;
            break;
        case "rbt":
            colorScheme = RED_BLUE_SCHEME;
            break;
        case "sct":
            colorScheme = SINGLE_SCHEME;
            break;
        case "agt":
            colorScheme = ANTARCTICA_SCHEME;
            break;
    }

    ctx.fillStyle = colorScheme[0];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    runSimulation(scaleRange.value, iterationsRange.value, ratioRange.value, parseFloat(angleRange.value));
    angleText.innerText = parseFloat(angleRange.value).toPrecision(4);
    ratioText.innerText = parseFloat(ratioRange.value).toPrecision(5);
    scaleText.innerText = scaleRange.value;
    iterationsText.innerText = iterationsRange.value;


}

animate();