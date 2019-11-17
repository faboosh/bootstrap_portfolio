export class BGRenderer {
    constructor() {
        this.w, this.h, this.canvas, this.ctx, this.maxScroll;
        this.targetFrame = 0;
        this.imgs = [];
        this.lastY = 0;
        this.currFrame = 0;
        this.scrollInterval = 200;
        this.scrollDown;
        this.lastDraw = performance.now();
        this.hasRendered = false;
        this.currPage;

        //Bildrutorna där animationen ska stanna
        this.keyframes = [
            0,
            60,
            120
        ];

        //Nuvarande bildruta i anmationen
        this.currKeyframe = 0;

        //Tar emot ett event (nav) från app.js, som updaterar 
        //vilken sida bakgrundsrenderaren tror användaren är på
        $('root-element').on('nav', e => {
            this.currPage = e.detail.page;
        })

        this.init();
    }

    //Uppdaterar animationens croppinginställningar
    //efter skärmstorlek
    updateOrientation() {
        if (window.innerWidth > window.innerHeight) {
            $('#background').css('width', '100vw');
            $('#background').css('height', '100vw');
        } else  {
            $('#background').css('width', '100vh');
            $('#background').css('height', '100vh');            
        }
    }

    init() {
        $('root-element').on('redraw', () => {
            this.hasRendered = false;
        })

        this.loadImg();

        //Kör efter sidan renderats klart
        document.querySelector('root-element').addEventListener('renderdone', () => {
            if (this.currPage.name == 'home') {
                this.maxScroll = document.querySelector('intro-video').clientHeight - window.innerHeight;

                this.canvas = document.getElementById('background');
                this.ctx = this.canvas.getContext('2d');
                this.ctx.imageSmoothingEnabled = false;

                //Initierar canvasens storlek och animationens croppinginställningar
                this.updateOrientation();
                this.updateRes();
                this.drawFrame();
            }

            //Kör förstagångssetupen för bakgrundsrenderaren
            if (!this.hasRendered) {

                //Uppdaterar canvasens storlek och animationens croppinginställningar
                //när skärmstorleken ändras och ritar om canvasen med nya inställningarna
                window.addEventListener('resize', () => {
                    this.updateOrientation();
                    this.updateRes();
                    this.drawFrame();
                })

                this.hasRendered = true;

                window.addEventListener('scroll', () => {
                    //Kollar om vi är på home-sidan (där animaitonen ritas upp)
                    if (this.currPage.name == 'home') {
                        //Kör om tiden sedan senaste scroll är länge än minimumtiden
                        let delta = performance.now() - this.lastDraw;
                        if (delta > this.scrollInterval) {

                            //Kör om användaren scrollat nedåt, uppdaterar targetFrame med nästa keyframe och startat animationen
                            if (this.lastY < window.scrollY) {
                                if (this.targetFrame < 120) {
                                    this.currKeyframe++;
                                    this.targetFrame = this.keyframes[this.currKeyframe];
                                }

                                this.scrollDown = true;
                                this.render();
                            }

                            //Kör om användaren scrollat uppåt, uppdaterar targetFrame med föregående keyframe och startat animationen
                            if (this.lastY > window.scrollY) {
                                if (this.targetFrame > 0) {
                                    this.currKeyframe--;
                                    this.targetFrame = this.keyframes[this.currKeyframe];
                                }

                                this.scrollDown = false;
                                this.render();
                            }

                        }
                    }
                })
            }
        });
    }

    render() {
        //renderar alla bildrutor från nuvarande (currFrame) fram till satt target (targetFrame)
        if (this.currFrame != this.targetFrame) {
            if (this.scrollDown && this.currFrame < this.imgs.length - 1) {
                this.currFrame++;
            }

            if (this.currFrame > 0 && !this.scrollDown) {
                this.currFrame--;
            }

            this.drawFrame();
            
            window.requestAnimationFrame(() => {
                this.render();
            });
        }
    }

    //Laddar och lagrar alla bildrutor till animationen
    loadImg() {   
        for (let i = 1; i <= 120; i++) {
            let img = new Image();
            img.src = `img/bg/webp/img(${i}).webp`;
            this.imgs.push(img);
        }
    }

    //
    /*getFrame(scroll) {
        let pos = scroll / this.maxScroll;
        pos = Math.round(pos * 120) / 100;
        let frame = Math.round(90 * pos);
        return frame;
    }*/

    //Ritar upp nuvarande bildruta och uppdaterar senaste scrollpositionen
    drawFrame() {
        this.lastY = window.scrollY;
        this.lastDraw = performance.now();
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.drawImage(this.imgs[this.currFrame], 0, 0, this.w, this.h);
    }

    //Uppdaterar canvasens upplösning till skärmens upplösning
    updateRes() {
        this.w = getComputedStyle(this.canvas).width.replace('px', '');
        this.h = window.innerHeight;
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.maxScroll = document.querySelector('intro-video').clientHeight - window.innerHeight;
        console.log('changed res');
    }
}
