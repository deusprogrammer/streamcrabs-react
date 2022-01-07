console.log("CLIENT_ID: " + process.env.REACT_APP_TWITCH_CLIENT_ID);
console.log("API URL:   " + process.env.REACT_APP_API_DOMAIN);

export default {
    //BASE_URL: "http://localhost:8080"
    MEDIA_SERVER_URL: "https://deusprogrammer.com/api/img-svc",
    BASE_URL: "https://deusprogrammer.com/api/streamcrabs",
    CLIENT_ID: process.env.REACT_APP_TWITCH_CLIENT_ID
}