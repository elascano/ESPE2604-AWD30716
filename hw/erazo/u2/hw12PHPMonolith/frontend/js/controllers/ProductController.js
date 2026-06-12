import { Product } from '../models/Product.js';

export class ProductController {
    constructor(view) {
        this.view = view;
        
        this.view.bindNavList(() => this.showList());
        this.view.bindNavCreate(() => this.showCreate());
        this.view.bindSubmitForm((e) => this.submitForm(e));
        this.view.bindUpdatePreview(() => this.view.updatePreview());
        
        this.showList();
    }

    showList() {
        this.view.switchView('list');
        this.loadProducts();
    }

    showCreate() {
        this.view.switchView('create');
    }

    async submitForm(e) {
        e.preventDefault();
        
        const data = this.view.getFormData();

        try {
            const result = await Product.create(data);
            
            if (result.success) {
                this.showList();
            } else if (result.errors) {
                this.view.showErrors(result.errors);
            } else {
                this.view.showErrors(['An unexpected error occurred.']);
            }
        } catch (err) {
            this.view.showErrors(['Failed to communicate with the server.']);
        }
    }

    async loadProducts() {
        this.view.showLoading();
        
        try {
            const data = await Product.getAll();
            this.view.renderTable(data.products, data.grandTotal);
        } catch (err) {
            this.view.showErrorLoading();
        }
    }
}
