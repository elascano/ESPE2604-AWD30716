const { createApp } = Vue;

createApp({
    data() {
        return {
            errorMessage: '',
            googleClientId: '974580556540-tc2i3fi7petusk75rm6iu4r7bt8lfn2f.apps.googleusercontent.com'
        }
    },
    mounted() {
        window.onload = () => {
            this.initializeGoogleOAuth();
        };
    },
    methods: {
        initializeGoogleOAuth() {
            google.accounts.id.initialize({
                client_id: this.googleClientId,
                callback: this.processGoogleResponse
            });
            
            google.accounts.id.renderButton(
                document.getElementById("googleSignInWrapper"),
                { theme: "filled_blue", size: "large", width: 300 }
            );
        },
        async processGoogleResponse(googleResponse) {
            try {
                const serverRequest = await fetch('api/authCallback.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: googleResponse.credential })
                });
                
                const serverData = await serverRequest.json();
                
                if (serverData.isAuthenticated) {
                    window.location.href = 'views/dashboard.php';
                } else {
                    this.errorMessage = "Invalid access token.";
                }
            } catch (networkError) {
                this.errorMessage = "Server connection error.";
            }
        }
    }
}).mount('#authenticationApp');