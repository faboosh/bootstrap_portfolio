let w, h, canvas, ctx, maxScroll;
let targetFrame = 0;
let imgs = [];
let lastY = 0;
let currFrame = 0;
let scrollInterval = 200;
let scrollDown;
let lastDraw = performance.now();
let currKeyframe = 0;;
let keyframes = [
    0,
    30,
    120
]

document.querySelector('root-element').addEventListener('renderdone', () => {
    maxScroll = document.querySelector('intro-video').clientHeight - window.innerHeight;
    console.log('render recieved');
    
    if(window.innerWidth > window.innerHeight) {
        $('#background').css('width', '100vw');
        $('#background').css('height', '100vw');
    }    
    
    canvas = document.getElementById('background');
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    updateRes();
    drawFrame();

    window.addEventListener('resize', () => {
        updateRes();
        drawFrame();
    })
    
    window.addEventListener('scroll', () => {
        //targetFrame = getFrame(window.scrollY);
        let delta = performance.now() - lastDraw;
        if(delta > scrollInterval) {

            if(lastY < window.scrollY) {
                if(targetFrame < 120) {
                    currKeyframe++;
                    targetFrame = keyframes[currKeyframe];
                }
            
                scrollDown = true;
                render();
            } 
            
            if (lastY > window.scrollY) {
                if(targetFrame > 0) {
                    currKeyframe--;
                    targetFrame = keyframes[currKeyframe];
                }

                scrollDown = false;
                render();
            }
     
        }
    })
});

function render() {
    if(currFrame != targetFrame) {
        if(scrollDown && currFrame < imgs.length -1) {
            currFrame++;
        }
        
        if(currFrame > 0 && !scrollDown){
            currFrame--;
        }
        
        drawFrame();
        window.requestAnimationFrame(render);
    }

    /*if(currKeyframe == 0) {
        window.scrollTo(0, 0);     
    }

    if(currKeyframe == 2) {
        window.scrollTo(maxScroll, 0);           
    }*/
}

for (let i = 1; i <= 121; i++) {
    let img = new Image();
    img.src = `img/bg/png/webp(${i}).webp`; 
    imgs.push(img);
}

function getFrame(scroll) {
    let pos = scroll / maxScroll; 
    pos = Math.round(pos * 100) / 100;
    let frame = Math.round(120 * pos);
    return frame;
}

function drawFrame() {
    lastY = window.scrollY;
    lastDraw = performance.now();
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(imgs[currFrame], 0, 0, w, h);
}

function updateRes() {
    w = getComputedStyle(canvas).width.replace('px','');
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    maxScroll = document.querySelector('intro-video').clientHeight - window.innerHeight;
    console.log('changed res');
}