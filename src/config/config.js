console.log("CLIENT_ID:        " + process.env.REACT_APP_TWITCH_CLIENT_ID);
console.log("API URL:          " + process.env.REACT_APP_API_DOMAIN);
console.log("MEDIA SERVER URL: " + process.env.REACT_APP_MEDIA_SERVER_URL);

export default {
    //BASE_URL: "http://localhost:8080"
    //MEDIA_SERVER_URL: "https://deusprogrammer.com/api/img-svc",
    MEDIA_SERVER_URL: process.env.REACT_APP_MEDIA_SERVER_URL,
    BASE_URL: process.env.REACT_APP_API_DOMAIN,
    CLIENT_ID: process.env.REACT_APP_TWITCH_CLIENT_ID,
    TWITCH_AUTH_URL: `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_TWITCH_CLIENT_ID}&redirect_uri=https://deusprogrammer.com/streamcrabs/registration/callback&response_type=code&scope=chat:read%20chat:edit%20channel:read:redemptions%20channel:manage:redemptions%20channel:read:subscriptions%20bits:read`
}