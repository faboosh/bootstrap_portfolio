import { App } from '../js/app.js';
import { BGRenderer } from '../js/bgrenderer.js';

let fx = new BGRenderer();

let app = new App();

app.addRoutes([['home', 'intro-video'], ['portfolio', 'my-portfolio'], ['about', 'about-me']]);

$('document').ready(() => {
    app.updateCurrentPage({
        name: 'home',
        elem: document.querySelector('intro-video')
    });
    app.render("home");
});

$('#logo').click(() => {
    app.updateCurrentPage({
        name: 'home',
        elem: document.querySelector('intro-video')
    });
    app.hideHamburger();
    app.render("home");
});

window.addEventListener('resize', () => {
    app.scrollToCurrent();
})



$('#portfolio-carousel').click(() => {
    $('#portfolio-carousel').carousel('pause');  
})
