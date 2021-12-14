import React from 'react';

export default class Home extends React.Component {
    render() {
        return (
            <div style={{textAlign: "center"}}>
                <img style={{width: "500px"}} src={`${process.env.PUBLIC_URL}/streamcrab.png`} />
                <h1>Welcome to Streamcrabs</h1>
                <h2>What is Streamcrabs?</h2>
                <p>Streamcrabs is an open source Twitch bot and tool for setting up custom alerts and tools.</p>
                <h2>What does Streamcrabs Currently Support?</h2>
                <p>Streamcrabs currently supports many alerts (with the exception of follows), as well as some unique concepts like dynamic alerts where the alert changes based on the size of whatever happened (i.e. the number of raiders in a raid).</p>
                <p>Streamcrabs is also home to Chat Battle Dungeon, which is a full fledged dungeon battler game played in chat.  More details about that can be found on <a href="https://deusprogrammer.com/cbd">https://deusprogrammer.com/cbd</a></p>
                <h2>How do I use Streamcrabs?</h2>
                <p>Streamcrabs currently runs out of my home server lab.  Until I have hosting for the app, I will be accepting users on a limited basis.  To request access please join our <a href="https://discord.gg/t4Yr5WpmB7">Discord</a> and put your request on the access request board with your Twitch username.</p>
            </div>
        );
    }
}