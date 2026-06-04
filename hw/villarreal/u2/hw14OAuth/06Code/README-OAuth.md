# OAuth

OAuth (Open Authorization) is an open standard for authorization that allows users to give apps limited access to their information or resources on another service without sharing their passwords. OAuth uses access tokens that represent specific permissions instead of giving the apps direct login credentials.

It often works behind the scenes when the user signs into a website using, for example, a Google account. Usually, the process consists of the user authenticating with a trusted provider, approving permissions, and the provider using a token that the app can use to access certain data.

With OAuth, both security and convenience improve because users do not have to expose their passwords to third-party applications, and the access can be restricted to just the necessary permissions.

## Google Sign-in
*steps provided by Google in: [Integrating Google Sign-In into your web app](https://developers.google.com/identity/sign-in/web/sign-in)*

### Create authorization credentials
1. Go to the [Clients page](https://console.developers.google.com/auth/clients).
2. Click Create Client.
3. Select the Web application application type.
4. Name your OAuth 2.0 client and click Create

### Load the Google Platform Library
<script src="https://apis.google.com/js/platform.js" async defer></script>

### Specify your app's client ID
<meta name="google-signin-client_id" content="YOUR_CLIENT_ID.apps.googleusercontent.com">

### Add a Google Sign-In button
<div class="g-signin2" data-onsuccess="onSignIn"></div>

### Get profile information
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}
