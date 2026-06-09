import { ProductView } from './views/ProductView.js';
import { ProductController } from './controllers/ProductController.js';

document.addEventListener('DOMContentLoaded', () => {
    const view = new ProductView();
    new ProductController(view);
});
