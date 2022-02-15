import React from 'react';

export default class About extends React.Component {
    render() {
        return (
            <div style={{textAlign: "center"}}>
                <img style={{width: "300px"}} src={`${process.env.PUBLIC_URL}/streamcrab.png`} />
                <h1>Welcome to Streamcrabs</h1>
                <h2>What is Streamcrabs?</h2>
                <p>Streamcrabs is an open source Twitch bot and tool for setting up custom alerts and tools.</p>
                <h2>What does Streamcrabs Currently Support?</h2>
                <p>Streamcrabs currently supports the following:</p>
                <ul>
                    <li>Animated subscription, cheer, follow, and raid alerts utilizing animated gifs, mp4's, and mp3's.</li>
                    <li>Dynamic alerts where the size of the cheer, subscription or raid is reflected in a dynamically generated animation</li>
                    <li>Custom channel point rewards</li>
                    <li>Custom commands with configurable cool downs that play video or sound overlays</li>
                    <li>Gauges for tracking subscription goals, cheer goals, and custom goals triggered by channel point redemption</li>
                    <li>Chat Battle Dungeon mini game where you fight monsters that show up in chat for loot and gear</li>
                </ul>
                <h2>How do I use Streamcrabs?</h2>
                <p>Streamcrabs currently runs out of my home server lab.  Until I have hosting for the app, I will be accepting users on a limited basis.  To request access please join our <a href="https://discord.gg/t4Yr5WpmB7">Discord</a> and put your request on the access request board with your Twitch username.</p>
            </div>
        );
    }
}