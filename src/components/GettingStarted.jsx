import React from 'react';

export default () => {
    return (
        <div>
            <h1>Getting Started</h1>
            <h2>Table of Contents</h2>
            <ul>
                <li><a href="#mediapool">Adding Media to the Media Pool</a></li>
                <li><a href="#alerts">Setting up Alerts</a></li>
                <li><a href="#commands">Setting up Custom Commands</a></li>
                <li><a href="#dynamicalerts">Setting up Dynamic Alerts</a></li>
                <li><a href="#overlays">Setting up Overlays</a></li>
                <li><a href="#bot">Controlling the Bot</a></li>
                <li><a href="#other">Other Windows</a></li>
            </ul>
            <div>
                <h2 id="mediapool">Adding Media to the Media Pool</h2>
                <p>In order to setup alerts you must add media to the media pools.  The media pools accept mp3's for the audio pool and mp4's for the video pool.</p>
                <p>Under the media pool section you can upload your sounds and videos and then label them and adjust their attributes.  For example on video you can set a chroma key that will remove the background of chroma keyed videos automatically for video based alerts.  You can set volume levels for both audio and video in case the file is too loud on your stream.</p>
            </div>
            <div>
                <h2 id="alerts">Setting up Alerts</h2>
                <p>Under the Alerts section you can tie various media from your media pools to play when said event happens.</p>
                <p>You can also set a custom message format for each one.  The message format uses special strings to represent the variables for each event like who subscribed or how many bits were cheered.  These strings are documented on the alerts page.</p>
            </div>
            <div>
                <h2 id="commands">Setting up Custom Commands</h2>
                <p>The Commands section allows you to create custom commands.  You simply give it a command name (i.e. !fart), a cooldown (i.e. 30m), and then select the media you want it to play.  There will be more command types in the future.</p>
            </div>
            <div>
                <h2 id="dynamicalerts">Setting up Dynamic Alerts</h2>
                <p>The Dynamic Alerts section requires the use of sprite sheets to create sprites for dynamic alerts.  In a dynamic alert, a number of animated sprites will run across the screen based on things like number of raiders, number of bits cheered, sub tier, etc.</p>
                <p>The tool is somewhat self explanatory, but I will add a how to video below.</p>
            </div>
            <div>
                <h2 id="overlays">Setting up Overlays</h2>
                <p>Under the Bot section, you will see a variety of overlay urls.  You must place the multi overlay and the sound player on your streaming software scene where you want them and whatever size you want.  It's recommended however to make the multi overlay fullscreen and the soundplayer somewhat small as it just sounds a speaker symbol.</p>
            </div>
            <div>
                <h2 id="bot">Controlling the Bot</h2>
                <p>To start the bot, simply click the "Start" button on the Bot page.  And then click "Stop" to stop it.</p>
            </div>
            <div>
                <h2 id="other">Other Windows</h2>
                <p>There are also some other tools that can be launched.  These are the TTS window for enabling the text to speech command and the What the Dub game window.  What the Dub is a separate game that I will document else where.</p>
            </div>
        </div>
    )
}