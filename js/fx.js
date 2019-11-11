//let JSZip = new JSZip();

let w, h, canvas, ctx, maxScroll;
let targetFrame = 0;
let imgs = [];
let lastY = 0;
let currFrame = 0;
let scrollInterval = 200;
let scrollDown;
let lastDraw = performance.now();


//Bildrutorna där animationen ska stanna
let keyframes = [
    0,
    30,
    120
];

//
let currKeyframe = 0;

//Kör efter 
document.querySelector('root-element').addEventListener('renderdone', () => {
    maxScroll = document.querySelector('intro-video').clientHeight - window.innerHeight;

    if (window.innerWidth > window.innerHeight) {
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
        //Kör om tiden sedan senaste scroll är länge än minimumtiden
        let delta = performance.now() - lastDraw;
        if (delta > scrollInterval) {

            //Kör om användaren scrollat nedåt, uppdaterar targetFrame med nästa keyframe och startat animationen
            if (lastY < window.scrollY) {
                if (targetFrame < 120) {
                    currKeyframe++;
                    targetFrame = keyframes[currKeyframe];
                }

                scrollDown = true;
                render();
            }

            //Kör om användaren scrollat uppåt, uppdaterar targetFrame med föregående keyframe och startat animationen
            if (lastY > window.scrollY) {
                if (targetFrame > 0) {
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
    //renderar alla bildrutor från nuvarande (currFrame) fram till satt target (targetFrame)
    if (currFrame != targetFrame) {
        if (scrollDown && currFrame < imgs.length - 1) {
            currFrame++;
        }

        if (currFrame > 0 && !scrollDown) {
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

//Laddar och lagrar alla bildrutor
for (let i = 1; i <= 121; i++) {
    let img = new Image();
    img.src = `img/bg/webp/img(${i}).webp`;
    imgs.push(img);
}

/*JSZip.loadAsync("img/bg/webp/webp.zip")
    .then(function (zip) {
        // you now have every files contained in the loaded zip
        //new_zip.file("hello.txt")
        ctx.drawImage(jszip.file("img(1).webp"), 0, 0, w, h);
    });*/

/*fetch('/jszip/test/ref/text.zip')       // 1) fetch the url
    .then(function (response) {                       // 2) filter on 200 OK
        if (response.status === 200 || response.status === 0) {
            return Promise.resolve(response.blob());
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    })
    .then(JSZip.loadAsync)                            // 3) chain with the zip promise
    .then(function (zip) {
        return zip.file("Hello.txt").async("string"); // 4) chain with the text content promise
    })*/


//
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
    w = getComputedStyle(canvas).width.replace('px', '');
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    maxScroll = document.querySelector('intro-video').clientHeight - window.innerHeight;
    console.log('changed res');
}