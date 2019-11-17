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
            30,
            120
        ];

        //
        this.currKeyframe = 0;

        $('root-element').on('nav', e => {
            this.currPage = e.detail.page;
        })

        this.init();
    }

    init() {
        this.loadImg();
        //Kör efter 
        document.querySelector('root-element').addEventListener('renderdone', () => {
            if (this.currPage.name == 'home') {
                this.maxScroll = document.querySelector('intro-video').clientHeight - window.innerHeight;
                if (window.innerWidth > window.innerHeight) {
                    $('#background').css('width', '100vw');
                    $('#background').css('height', '100vw');
                }

                this.canvas = document.getElementById('background');
                this.ctx = this.canvas.getContext('2d');
                this.ctx.imageSmoothingEnabled = false;
                this.updateRes();
                this.drawFrame();

            }

            if (!this.hasRendered) {

                window.addEventListener('resize', () => {
                    this.updateRes();
                    this.drawFrame();
                })

                this.hasRendered = true;

                window.addEventListener('scroll', () => {
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

    loadImg() {
        //Laddar och lagrar alla bildrutor
        for (let i = 1; i <= 121; i++) {
            let img = new Image();
            img.src = `img/bg/webp/img(${i}).webp`;
            this.imgs.push(img);
        }
    }

    //
    getFrame(scroll) {
        let pos = scroll / this.maxScroll;
        pos = Math.round(pos * 100) / 100;
        let frame = Math.round(120 * pos);
        return frame;
    }

    drawFrame() {
        this.lastY = window.scrollY;
        this.lastDraw = performance.now();
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.drawImage(this.imgs[this.currFrame], 0, 0, this.w, this.h);
    }

    updateRes() {
        this.w = getComputedStyle(this.canvas).width.replace('px', '');
        this.h = window.innerHeight;
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.maxScroll = document.querySelector('intro-video').clientHeight - window.innerHeight;
        console.log('changed res');
    }
}
