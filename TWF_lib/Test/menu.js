const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight
});


let cont = new PIXI.Container()


// event.preventDefault prevents document scroll from scrolling when scrolling on the canvas
document.body.addEventListener("wheel", function(event){
    event.preventDefault()
});

document.body.appendChild(app.view);

// Add a display element
const graphic = new PIXI.Graphics()
    .beginFill(0xFF0000)
    .drawRect(0, 0, 200, 200);

graphic.interactive = true; // <-- required
graphic.on('scroll', (ev) => {
    graphic.y -= ev.wheelDelta;
    if (graphic.y > window.innerHeight - 200) graphic.y = window.innerHeight - 200
    if (graphic.y < 0) graphic.y = 0
});

const text = new PIXI.Text("Mousewheel over box,\nthe main document scroll \nwon't scroll while scrolling\non the canvas", {
    fontSize: 20,
    fontWeight: 'bold',
    fill: 0xffffff
});
text.x = 220;
cont.x += 500
cont.y += 200
cont.width = 300
cont.height = 300
cont.addChild(graphic)

app.stage.addChild(cont, text);

// cache a global mouse position to keep from 
// creating a point every mousewheel event
const mousePosition = new PIXI.Point();

// Listen for global events on the <canvas> element
// and convert those into scroll event
app.view.addEventListener('wheel', (ev) => {
    mousePosition.set(ev.clientX, ev.clientY); // get global position

    // returns element directly under mouse
    const found = app.renderer.plugins.interaction.hitTest(
        mousePosition,
        app.stage
    );

    // Dispatch scroll event
    if (found) { found.emit('scroll', ev); }
});