export class App {
    constructor() {
        this.lang = {
            se: {
                nav: {
                    about: 'Om mig',
                    lang: 'Språk',
                    swe: 'Svenska',
                    eng: 'Engelska'
                },
    
                elements: [
                    {
                        text: '<span class="text-danger">Hej</span>, jag heter <span class="text-danger">Fabian!</span>',
                        var: '$introduction'
                    },
                    {
                        text: 'Jag pluggar till fullstack-webbutvecklare på Nackademin i Stockholm',
                        var: '$intro-description'
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
                    },
                    {
                        text: 'Scrolla för att fortsätta!',
                        var: '$scroll-prompt'
                    },
                    {
                        text: 'Hoppa till text-intro',
                        var: '$skip-intro'
                    }
                ],

                projects: [
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
                        desc: `Cloud Studio är ett B2B CRM-system där användaren kan se en översikt
                            över sina kunder, lägga till nya kunder, skapa kalenderhändelser
                            och att-göra listor samt skicka kundenkäter. 
                            All kommunikation mellan komponenterna är eventbaserad,
                            så det är lätt att lägga till nya komponenter som kan
                            ta del av existerande dataströmmar
                            <br>
                            <br>
                            <span class="text-white">Teknologier:</span> HTML5, SASS, JavaScript`
                    },
                    {
                        title: 'Min portfolio',
                        h4: 'VM i over-engineerng',
                        desc: `Min portfolio är byggd som en SPA, och har ett förrenderat 
                        3D-intro gjort i blender, där uppspelningspositionen är mappan till scrollen.
                        <br>
                        <br>
                        <span class="text-white">Teknologier:</span> HTML5, SASS, JavaScript, jQuery, Bootstrap`
                    }
                ]
            },

            en: {
                nav: {
                    about: 'About me',
                    lang: 'Language',
                    swe: 'Swedish',
                    eng: 'English'
                },
    
                elements: [
                    {
                        text: '<span class="text-danger">Hi</span>, I\'m <span class="text-danger">Fabian!</span>',
                        var: '$introduction'
                    },
                    {
                        text: 'I\'m a fullstack web developer student at Nackademin in Stockholm',
                        var: '$intro-description'
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
                    {
                        text: 'Scroll to continue!',
                        var: '$scroll-prompt'
                    },
                    {
                        text: 'Skip to text intro',
                        var: '$skip-intro'
                    }
                ],

                projects: [
                    {
                        title: 'RETROQUIZ',
                        h4: 'A simple quiz game with 10 questions.',
                        desc: `Well, the quiz part is simple. The background is randomly generated and rendered live. 
                                To offload the main thread, the background is rendered in two web workers, each outputting to an offscreen canvas.
                                <br>
                                <br>
                                <span class="text-white">Technologies used:</span> HTML5, CSS3, JavaScript`
                    },
                    {
                        title: 'Cloud Studio',
                        h4: 'A component based CRM system',
                        desc: `Cloud Studio is a basic CRM system, which allows the 
                                user to see an overview of their customers,
                                add new customers, 
                                create calendar events and todo lists and
                                send surveys. 
                                All communication between components is event based, which means any future components
                                 easily can tap into the events and get access to the same data.
                                 <br>
                                 <br>
                                 <span class="text-white">Technologies used:</span> HTML5, SASS, JavaScript`
                    },
                    {
                        title: 'My portfolio',
                        h4: 'A journey into over-engineering',
                        desc: `My portfolio is an SPA. It features a prerendered 
                                3D-animation made in Blender, where the scroll 
                                position is mapped to the playback position.
                                <br>
                                <br>
                                <span class="text-white">Technologies used:</span> HTML5, SASS, JavaScript, jQuery, Bootstrap`
                    }
                ]
            }
        }

        this.routes = [];

        this.currentPage;

        this.hamburgerShow = false;

        //Trackar om hamburgermenyn är öppen eller inte
        $('#hamburger').click(() => {
            if (this.hamburgerShow) {
                this.hamburgerShow = false;
            } else {
                this.hamburgerShow = true;
            }

            console.log(this.hamburgerShow);
        })

        this.lastScrollTrack = 0;

        this.setup();
        
        //Scrollar tillbaka dit användaren var efter språkbyte
        $('root-element').on('renderdone', () => {
            setTimeout(this.scrollToCurrent(), 500);
        })
    }

    //Förstagångssetup som laddar in språkinställningar, 
    //lägger eventlisterners på språkbytesknappar och
    //initierar current page
    setup() {
        document.getElementById('swe').addEventListener('click', e => {
            e.preventDefault();
            console.log('swe');
            localStorage.setItem('lang', 'sv');
            this.changeLang();
        })
    
        document.getElementById('eng').addEventListener('click', e => {
            e.preventDefault();
            console.log('eng');
            localStorage.setItem('lang', 'en');   
            this.changeLang();
        })

        this.updateCurrentPage({
            name: 'home',
            elem: 'intro-video'
        });

        this.setupScrollTracker();

        this.checkLang();
    }

    //Trackar scrollpositionen och uppdaterar nuvarande sidan till närmsta sida
    setupScrollTracker() {
        window.addEventListener('scroll', () => {
            if (performance.now() > this.lastScrollTrack + 500) {
                this.lastScrollTrack = performance.now();

                let nearest;

                let scrollTop = $(window).scrollTop();
                this.routes.forEach(route => {
                    let elementPos = $(route[1]).position().top;
                    if (scrollTop + 300 >= elementPos) {
                        nearest = route;
                    }
                })

                setTimeout(() => {
                    this.updateCurrentPage({
                        name: nearest[0],
                        elem: nearest[1]
                    })
                }, 200);
            }
        })
    }

    //laddar in och renderar vald sida
    render(path) {
        $.ajax({
            url: 'components/' + path + '.html',
            contentType: "application/json; charset=utf-8"
        }).done(page => {

            //Döljer allt innehåll i sidan, renderar den, 
            //byter ut alla texter till motsvarande språk 
            //och visar sedan sidan
            $('root-element').hide();
            $('root-element').empty();
            $('root-element').append(page);

            //Laddar in alla subkomponenter till home-sidan
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

                    //Uppdaterar beskrivningarna i projekt-karusellen till rätt språk
                    function setProject(i) {
                        $('#project-title').html(_this.selectedLang.projects[i].title);
                        $('#project-h4').html(_this.selectedLang.projects[i].h4);
                        $('#project-description').html(_this.selectedLang.projects[i].desc);
                    }

                    setProject(0);

                    //Uppdaterar projekttexten till motsvarande karusell-video
                    $('#portfolio-carousel').on('slide.bs.carousel', e => {
                        setProject(e.to);
                    })

                    //Stänger av auto-cycling i karusellen efter användaren interagerat med den
                    $('#portfolio-carousel').click(() => {
                        $('#portfolio-carousel').carousel('pause');  
                    })
                })
            } else {
                this.translate();
            }
        });
    }

    //Översätter alla element i sidan, visar sidinehållet och signalerar till
    //bakgrundsrenderaren att sidan är färdigrenderad
    translate() { 
        $('#about').html(this.selectedLang.nav.about);
        $('#lang-select').html(this.selectedLang.nav.lang);
        $('#swe').html(this.selectedLang.nav.swe);
        $('#eng').html(this.selectedLang.nav.eng);

        this.selectedLang.elements.forEach(line => {
            document.querySelector('root-element').innerHTML = document.querySelector('root-element').innerHTML.replace(line.var, line.text);
        })
        $('root-element').show();

        this.signalDone();
    }

    //Signalerar till bakgrundsrenderaren att all HTML har hämtats
    signalDone() {
        document.querySelector('root-element').dispatchEvent(new CustomEvent('renderdone', {}));
    }

    //Uppdaterar nuvarande sidan och skickar ut ett event med den uppdaterade informationen
    updateCurrentPage(currentPage) {
        this.currentPage = currentPage;
        console.log(this.currentPage);

        let nav = new CustomEvent('nav', {
            detail: {
                page: this.currentPage
            }
        });

        document.querySelector('root-element').dispatchEvent(nav);

        if(this.currentPage.name != 'home') {
            $('skip-intro').fadeOut();
        }
    }

    //Lägger till alla sidor som routes i navbaren
    addRoutes(routes) {
        this.updateCurrentPage({
            name: 'home',
            elem: 'intro-video'
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
                    elem: route[1]
                });

                this.signalDone();
                setTimeout(() => this.scrollToCurrent(), 0);
            })
        })
    }

    //Döljer hamburgermenyn efter navigering
    hideHamburger() {
        if (this.hamburgerShow) {
            $('#hamburger').trigger('click');
        }
    }

    //Scrollar till aktivt element, kan force-overrideas
    scrollToCurrent(force) {
        if(force != null || force != undefined) {
            document.querySelector(force).scrollIntoView();
        } else {
            document.querySelector(this.currentPage.elem).scrollIntoView();
        }   
    }

    //Byter språk
    changeLang() {
        let redraw = new CustomEvent('redraw', {});
        document.dispatchEvent(redraw);
        this.checkLang();

        this.render('home');
    }

    //Kollar vilket språk som är satt i localstorage, defaultar till engelska vid inget värde
    checkLang() {
        let lang;
        if (localStorage.getItem('lang') == 'sv') {
            this.selectedLang = this.lang.se;
            lang = new CustomEvent('lang', {detail: {lang: 'sv'}});
        } else {
            this.selectedLang = this.lang.en;
            lang = new CustomEvent('lang', {detail: {lang: 'en'}});
        }

        document.querySelector('root-element').dispatchEvent(lang);
    }
}