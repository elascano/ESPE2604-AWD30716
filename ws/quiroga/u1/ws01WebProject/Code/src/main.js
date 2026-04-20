import { HomePageController } from './controllers/HomePageController.js';

document.addEventListener('DOMContentLoaded', () => {
    // Si tienes un Router, esto iría dentro del case 'home' o 'dashboard'
    HomePageController.init();
});