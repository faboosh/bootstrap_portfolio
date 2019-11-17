export class App {
    constructor() {
        this.lang = {
            se: [
                {
                    text: '<span class="text-danger">Hej</span>, jag <br> heter <br> <span class="text-danger">Fabian!</span>',
                    var: '$introduction'
                },
                {
                    text: 'Jag är en kreativ person med stort datorintresse, som älskar att pusha tekniska gränser och experimenterera. <br>Jag trivs som bäst när jag både får designa och jobba med logisk problemlösning.',
                    var: '$about-text'
                },
                {
                    text: 'Om mig',
                    var: '$about-title'
                },
                {
                    text: 'Kontaktinfo',
                    var: '$contact-title'
                }
            ],
            en: [
                {
                    text: '<span class="text-danger">Hej</span>, jag <br> heter <br> <span class="text-danger">Fabian!</span>',
                    var: '$introduction'
                },
                {
                    text: 'I\'m a creative person with a passion for computers, who loves pushing techincal boundaries and experimenting <br>I do my best work when I get to both design and work with problem solving.',
                    var: '$about-text'
                },
                {
                    text: 'About me',
                    var: '$about-title'
                },
                {
                    text: 'Contact',
                    var: '$contact-title'
                },
            ]
        }

        this.projects = [
            {
                title: 'RETROQUIZ',
                h4: 'Ett enkelt quiz-spel med 10 frågor.',
                desc: `Eller ja, quiz-delen är enkel. Bakgrunden är helt slumpgenererad och renderas live. 
                        För att avlasta huvudtråden renderas den i 2 offscreen-canvases i varsin web-worker.
                        <br>
                        <br>
                        <span class="text-white">Teknologier:</span> HTML5, CSS3, JavaScript`
            },
            {
                title: 'Cloud Studio',
                h4: 'Ett komponentbaserat CRM-system',
                desc: 'Desc 2'
            },
            {
                title: 'Title 3',
                h4: 'Title 2',
                desc: 'Desc 3'
            }
        ];

        this.pageIDs = {
            home: '#home',
            portfolio: 'my'
        }

        this.routes = [];

        this.currentPage;

        this.hamburgerShow = false;

        $('#hamburger').click(() => {
            if (this.hamburgerShow) {
                this.hamburgerShow = false;
            } else {
                this.hamburgerShow = true;
            }

            console.log(this.hamburgerShow);
        })

        this.lastScrollTrack = 0;
    }

    setupScrollTracker() {
        window.addEventListener('scroll', () => {
            if (performance.now() > this.lastScrollTrack + 500) {
                this.lastScrollTrack = performance.now();

                let scrollTop = $(window).scrollTop();
                this.routes.forEach(route => {
                    let elementPos = $(route[1]).position().top;
                    if (scrollTop + 300 >= elementPos) {
                        this.updateCurrentPage({
                            name: route[0],
                            elem: document.querySelector(route[1])
                        });
                    }
                })
            }
        })
    }

    //laddar in och renderar vald sida
    render(path) {
        $.ajax({
            url: 'components/' + path + '.html',
            contentType: "application/json; charset=utf-8"
        }).done(page => {
            //Uppdaterar addressfältet och lägger till routen i sökhistoriken
            //window.history.pushState({}, '', window.origin + '/' + path.replace('.html', ''));

            //Döljer allt innehåll i sidan, renderar den, 
            //byter ut alla texter till motsvarande språk 
            //och visar sedan sidan
            $('html').hide();
            $('root-element').empty();
            $('root-element').append(page);

            if (path == 'home') {
                $.ajax({
                    url: 'components/about.html',
                    contentType: "application/json; charset=utf-8"
                }).done(about => {
                    $('about-me').append(about);
                    this.translate();
                })

                $.ajax({
                    url: 'components/portfolio.html',
                    contentType: "application/json; charset=utf-8"
                }).done(portfolio => {
                    $('my-portfolio').append(portfolio);
                    this.translate();

                    let _this = this;

                    function setProject(i) {
                        $('#project-title').html(_this.projects[i].title);
                        $('#project-h4').html(_this.projects[i].h4);
                        $('#project-description').html(_this.projects[i].desc);
                    }

                    setProject(0);

                    $('#portfolio-carousel').on('slide.bs.carousel', e => {
                        setProject(e.to);
                    })

                    $('#portfolio-carousel').carousel('pause');  
                })
            } else {
                this.translate();
            }
        });
    }

    translate() {
        this.lang.se.forEach(line => {
            document.querySelector('root-element').innerHTML = document.querySelector('root-element').innerHTML.replace(line.var, line.text);
        })

        $('html').show();

        this.signalDone();
    }

    signalDone() {
        document.querySelector('root-element').dispatchEvent(new CustomEvent('renderdone', {}));
    }

    updateCurrentPage(currentPage) {
        this.currentPage = currentPage;
        console.log(this.currentPage);

        let nav = new CustomEvent('nav', {
            detail: {
                page: this.currentPage
            }
        });

        document.querySelector('root-element').dispatchEvent(nav);
    }

    addRoutes(routes) {
        this.updateCurrentPage({
            name: 'home',
            elem: document.querySelector('intro-video')
        });

        this.routes = routes;
        console.log(routes);
        this.routes.forEach(route => {
            console.log(route[0]);
            $('#' + route[0]).click(() => {
                console.log('clicked ' + route[0]);
                this.hideHamburger();
                this.updateCurrentPage({
                    name: route[0],
                    elem: document.querySelector(route[1])
                });

                this.signalDone();
                setTimeout(() => this.scrollToCurrent(), 0);
            })
        })

        this.setupScrollTracker();
    }

    hideHamburger() {
        if (this.hamburgerShow) {
            $('#hamburger').trigger('click');
        }
    }

    scrollToCurrent() {
        this.currentPage.elem.scrollIntoView();
    }
}