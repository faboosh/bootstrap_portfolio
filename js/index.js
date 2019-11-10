class App {
    constructor() {
        this.se = [
            {
                text: '<span class="text-danger">Hej</span>, jag <br> heter <br> <span class="text-danger">Fabian!</span>',
                var: '$introduction'
            }
        ]
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
            document.querySelector('root-element').innerHTML = document.querySelector('root-element').innerHTML.replace(this.se[0].var, this.se[0].text);
            $('html').show();
            let done = new CustomEvent('renderdone', {});
            document.querySelector('root-element').dispatchEvent(done);
        }); 
    } 
}

let app = new App();

$('document').ready(() => app.render("home"));

$('#home').click(() => app.render("home"));

$('#logo').click(() => app.render("home"));

$('#about-me').click(() => app.render("about"));

$('#contact').click(() => app.render("contact"));




