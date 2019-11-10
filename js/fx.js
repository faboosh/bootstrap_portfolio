let w, h, canvas, ctx, maxScroll;
let imgs = [];
let lastY = 0;

document.querySelector('root-element').addEventListener('renderdone', () => {
    maxScroll = document.querySelector('intro-video').clientHeight - window.innerHeight;
    console.log('render recieved');
    
    if(window.innerWidth > window.innerHeight) {
        $('#background').css('width', '100vw');
        $('#background').css('height', '100vw');
    }    
    
    canvas = document.getElementById('background');
    ctx = canvas.getContext('2d');
    updateRes();
    drawFrame();

    window.addEventListener('resize', () => {
        updateRes();
        drawFrame();
    })
    
    window.addEventListener('scroll', () => {
        if(window.scrollY - lastY > 20) {
            drawFrame();
        } else if (lastY - window.scrollY > 20) {
            drawFrame();
        }
    })
});


for (let i = 1; i <= 121; i++) {
    let img = new Image();
    img.src = `img/bg/png/img(${i}).png`; 
    imgs.push(img);
}

function drawFrame() {
    lastY = window.scrollY;
    let pos = window.scrollY / maxScroll; 
    pos = Math.round(pos * 100) / 100;
    let frame = Math.round(120 * pos);
    if(pos <= 1) {
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(imgs[frame], 0, 0, w, h);
    } 
}

function updateRes() {
    w = getComputedStyle(canvas).width.replace('px','');
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    maxScroll = document.querySelector('intro-video').clientHeight - window.innerHeight;
    console.log('changed res');
}