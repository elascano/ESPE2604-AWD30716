
const SUPABASE_URL = "https://kljlrchsawiteqearbgy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsamxyY2hzYXdpdGVxZWFyYmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2Njg3ODQsImV4cCI6MjA5MzI0NDc4NH0.scWeGSJmm7xgxKg6F2sGqMTQsIATdX58AB0ZSZrXnvI";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const { createApp } = Vue;

createApp({
    data() {
        return {
            dishes: [],
            newDish: {
                name: '',
                price: ''
            },
            grid: null
        }
    },

    methods: {
        async fetchDishes() {
            const { data, error } = await supabaseClient
                .from('platos')
                .select('*');

            if (error) {
                console.error(error);
                return;
            }

            this.dishes = data;
            this.renderTable();
        },

        renderTable() {
            if (this.grid) {
                this.grid.destroy();
            }

            this.grid = new gridjs.Grid({
                columns: ["Name", "Price"],
                data: this.dishes.map(d => [d.nombre, d.precio]),
                search: true,
                pagination: {
                    limit: 5
                },
                sort: true
            }).render(document.getElementById("table"));
        },

        async addDish() {
            if (!this.newDish.name || !this.newDish.price) {
                alert("Fill all fields");
                return;
            }

            const { error } = await supabaseClient
                .from('platos')
                .insert([{
                    nombre: this.newDish.name,
                    precio: this.newDish.price
                }]);

            if (!error) {
                this.fetchDishes();
                this.newDish = { name: '', price: '' };
            }
        }
    },

    mounted() {
        this.fetchDishes();
    }

}).mount("#app");