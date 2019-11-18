import {App} from '../js/app.js';
import { BGRenderer } from '../js/bgrenderer.js';

let fx = new BGRenderer();
let app = new App();

//Initierar routern och laddar home-sidan
$('document').ready(() => {
    app.addRoutes([['home', 'intro-video'], ['portfolio', 'my-portfolio'], ['about', 'about-me']]);

    app.updateCurrentPage({
        name: 'home',
        elem: 'intro-video'
    });

    app.render("home");
});

//Skickar användaren tillbaka till hem när hen trycker på lggan
$('#logo').click(() => {
    app.updateCurrentPage({
        name: 'home',
        elem: 'intro-video'
    });

    app.hideHamburger();

    app.render("home");
});

//Scrollar till nuvarande aktivt element när skärmen byter storlek
window.addEventListener('resize', () => {
    app.scrollToCurrent();
})

