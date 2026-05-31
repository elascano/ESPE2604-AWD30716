const { createApp } = Vue;

createApp({
    data() {
        return {
            activeUserName: '',
            activeUserPicture: ''
        }
    },
    mounted() {
        const dashboardElement = document.getElementById('dashboardApp');
        if (dashboardElement) {
            this.activeUserName = dashboardElement.getAttribute('data-username');
            this.activeUserPicture = dashboardElement.getAttribute('data-userpicture');
        }
    }
}).mount('#dashboardApp');