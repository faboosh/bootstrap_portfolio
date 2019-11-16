class App {
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

        this.routes = [];

        this.currentPage = 'home';

        this.hamburgerShow = false;

        $('#hamburger').click(() => {
            if(this.hamburgerShow) {
                this.hamburgerShow = false;
            } else {
                this.hamburgerShow = true;
            }

            console.log(this.hamburgerShow);
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

                    function setProject(i) {
                        $('#project-title').html(projects[i].title);
                        $('#project-h4').html(projects[i].h4);
                        $('#project-description').html(projects[i].desc);
                    }

                    setProject(0);

                    $('#portfolio-carousel').on('slide.bs.carousel', e => {
                        setProject(e.to);
                    })
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
        let nav = new CustomEvent('nav', {
            detail: {
                page: this.currentPage
            }
        });

        document.querySelector('root-element').dispatchEvent(nav);
        
        let done = new CustomEvent('renderdone', {});
        document.querySelector('root-element').dispatchEvent(done); 
    }

    addRoutes(routes) {
        this.routes = routes;
        this.routes.forEach(route => {
            console.log(route);
            $('#' + route).click(() => {
                this.hideHamburger();
                this.currentPage = route;
                this.signalDone();
                //this.render(route);
            })
        })
    }

    hideHamburger() {
        if(this.hamburgerShow) {
            $('#hamburger').trigger('click');
        }
    }
}

let app = new App();

app.addRoutes(['home', 'about', 'contact']);

$('document').ready(() => {
    app.currentPage = 'home';
    app.render("home");
});

$('#logo').click(() => {
    app.currentPage = 'home';
    app.hideHamburger();
    app.render("home");
});

/*$('#about-me').click(() => app.render("about"));

$('#contact').click(() => app.render("contact"));*/

let projects = [
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

let projectIndex = 0;
