import { App } from '../js/app.js';
import { BGRenderer } from '../js/bgrenderer.js';

let fx = new BGRenderer();
let application;



$('document').ready(() => {
    application = new App();

    application.addRoutes([['home', 'intro-video'], ['portfolio', 'my-portfolio'], ['about', 'about-me']]);
    application.updateCurrentPage({
        name: 'home',
        elem: document.querySelector('intro-video')
    });
    application.render("home");
});

$('#logo').click(() => {
    application.updateCurrentPage({
        name: 'home',
        elem: document.querySelector('intro-video')
    });
    application.hideHamburger();
    application.render("home");
});

window.addEventListener('resize', () => {
    application.scrollToCurrent();
})

$('#portfolio-carousel').click(() => {
    $('#portfolio-carousel').carousel('pause');  
})
