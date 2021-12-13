import React from 'react';
import ApiHelper from '../utils/ApiHelper';
import {toast} from 'react-toastify';

const twitchAuthUrl = "https://id.twitch.tv/oauth2/authorize?client_id=uczfktv6o7vvdeqxnafizuq672r5od&redirect_uri=https://deusprogrammer.com/streamcrabs/registration/refresh&response_type=code&scope=chat:read%20chat:edit%20channel:read:redemptions%20channel:read:subscriptions%20bits:read";

export default class Bot extends React.Component {
    state = {
        buttonDisable: false,
        botState: {
            running: false,
            created: false
        },
        tokenState: {
            valid: false
        },
        botConfig: {},
        config: {
            cbd: true,
            requests: true,
            rewards: true,
            raid: true
        }
    }

    async componentDidMount() {
        document.title = "Bot Control Panel";
        console.log("CHANNEL: " + this.props.channel);
        if (!this.props.channel) {
            this.props.history.push(`${process.env.PUBLIC_URL}/registration/start`);
        }

        let config = await ApiHelper.getBotConfig(this.props.channel);

        Object.keys(this.state.config).forEach((key) => {
            if (!config[key]) {
                config[key] = false;
            }
        });

        // Check token state
        let tokenState = await ApiHelper.checkToken(this.props.channel);
        let botState = await ApiHelper.getBotState(this.props.channel);
        let botConfig = await ApiHelper.getBot(this.props.channel);
        this.setState({botState, tokenState, config, botConfig});

        if (!tokenState.valid) {
            window.location.replace(twitchAuthUrl);
        }

        setInterval(async () => {
            tokenState = await ApiHelper.checkToken(this.props.channel);
            botState = await ApiHelper.getBotState(this.props.channel);
            this.setState({botState, tokenState, buttonDisable: false});

            if (!tokenState.valid) {
                window.location.replace(twitchAuthUrl);
            }
        }, 5000);
    }

    changeBotState = async (state) => {
        this.setState({buttonDisable: true});
        await ApiHelper.changeBotState(this.props.channel, state);
        toast(`Bot ${state} successful`, {type: "info"});
    }

    onConfigChange = async (event, configItem) => {
        let config = {...this.state.config};
        config[configItem] = event.target.checked;
        await ApiHelper.updateBotConfig(this.props.channel, config);
        toast(`Bot config saved`, {type: "info"});
        this.setState({config});
    }

    refreshAccessToken = () => {
        window.location.replace(twitchAuthUrl);
    }

    render() {
        return (
            <div>
                <h1>Your Bot</h1>
                <h3>Panel URLs</h3>
                <p>Bring the below into your XSplit or OBS presentation layouts to show monsters and battle notifications.  It is recommended to place the encounter panel on either side of the screen, and the notification panel on the top or bottom of the screen.</p>
                <div style={{display: "table"}}>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>CBD Encounters Panel:</div>
                        <div style={{display: "table-cell", padding: "10px"}}><input type="text" value={`https://deusprogrammer.com/util/battle-panel/encounters?channelId=${this.props.channel}`} style={{width: "700px"}} /></div>
                    </div>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Soundboard:</div>
                        <div style={{display: "table-cell", padding: "10px"}}><input type="text" value={`https://deusprogrammer.com/util/twitch-tools/sound-player?channelId=${this.props.channel}`} style={{width: "700px"}} /></div>
                    </div>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Animation Overlay:</div>
                        <div style={{display: "table-cell", padding: "10px"}}><input type="text" value={`https://deusprogrammer.com/util/twitch-tools/multi?channelId=${this.props.channel}`} style={{width: "700px"}} /></div>
                    </div>
                </div>
                <h3>Stand Alone Panels</h3>
                <div style={{marginLeft: "10px"}}>
                    <a target="_blank" href={`https://deusprogrammer.com/util/twitch-tools/wtd?channelId=${this.props.channel}`}><button type="button">What the Dub</button></a><br />
                    <a target="_blank" href={`https://deusprogrammer.com/util/twitch-tools/tts?channelId=${this.props.channel}`}><button type="button">Text to Speech</button></a>
                </div>
                <h3>Actions</h3>
                <div style={{marginLeft: "10px"}}>
                    <button disabled={this.state.botState.running || this.state.buttonDisable} onClick={() => {this.changeBotState("start")}}>Start</button>
                    <button disabled={!this.state.botState.running || this.state.buttonDisable} onClick={() => {this.changeBotState("stop")}}>Stop</button>
                    <button disabled={this.state.buttonDisable} onClick={() => {this.changeBotState("restart")}}>Restart</button>
                </div>
            </div>
        )
    }
}