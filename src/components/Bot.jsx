import React from 'react';
import ApiHelper from '../utils/ApiHelper';
import {toast} from 'react-toastify';

const twitchAuthUrl = "https://id.twitch.tv/oauth2/authorize?client_id=uczfktv6o7vvdeqxnafizuq672r5od&redirect_uri=https://deusprogrammer.com/streamcrabs/registration/refresh&response_type=code&scope=chat:read%20chat:edit%20channel:read:redemptions%20channel:read:subscriptions%20bits:read";
const twitchBotAddUrl = "https://id.twitch.tv/oauth2/authorize?client_id=uczfktv6o7vvdeqxnafizuq672r5od&redirect_uri=https://deusprogrammer.com/streamcrabs/registration/registerBotUser&response_type=code&scope=chat:read%20chat:edit%20channel:read:redemptions%20channel:read:subscriptions%20bits:read&force_verify=true";

const configElementDescriptions = {
    cbd: "Chat Battle Dungeon",
    requests: "Request Queue",
    rewards: "Rewards",
    raid: "Raid Alerts"
}

export default class Bot extends React.Component {
    state = {
        channelId: parseInt(window.localStorage.getItem("channel")),
        buttonDisable: false,
        customRaidConfigs: [],
        selectedRaidConfig: "",
        botState: {
            running: false,
            created: false
        },
        tokenState: {
            valid: false
        },
        botConfig: {
            raidTheme: "ZELDA",
            botUser: {}
        },
        config: {
            cbd: true,
            requests: true,
            rewards: true,
            raid: true
        }
    }

    async componentDidMount() {
        document.title = "Bot Control Panel";
        if (!this.state.channelId) {
            this.props.history.push(`${process.env.PUBLIC_URL}/registration/start`);
        }

        let config = await ApiHelper.getBotConfig(this.state.channelId);

        Object.keys(this.state.config).forEach((key) => {
            if (!config[key]) {
                config[key] = false;
            }
        });

        // Check token state
        let tokenState = await ApiHelper.checkToken(this.state.channelId);
        let botState = await ApiHelper.getBotState(this.state.channelId);
        let botConfig = await ApiHelper.getBot(this.state.channelId);
        let customRaidConfigs = await ApiHelper.getRaidAlerts(this.state.channelId);
        customRaidConfigs = [...customRaidConfigs, {name: "Yoshi [Built In]", theme: "YOSHI", _id: null}, {name: "Zelda 2 [Built In]", theme: "ZELDA2", _id: null}];
        this.setState({botState, tokenState, config, botConfig, customRaidConfigs, selectedRaidConfig: `${botConfig.raidConfig.theme}:${botConfig.raidConfig.customId}`});

        if (!tokenState.valid) {
            window.location.replace(twitchAuthUrl);
        }

        setInterval(async () => {
            tokenState = await ApiHelper.checkToken(this.state.channelId);
            botState = await ApiHelper.getBotState(this.state.channelId);
            this.setState({botState, tokenState, buttonDisable: false});

            if (!tokenState.valid) {
                window.location.replace(twitchAuthUrl);
            }
        }, 5000);
    }

    updateRaidConfig = async (event) => {
        let key = event.target.value;
        let [theme, customId] = key.split(":");
        this.setState({selectedRaidConfig: key});
        if (customId === "null") {
            customId = null;
        }
        await ApiHelper.updateRaidAlertConfig(this.state.channelId, {theme, customId});
        toast(`Raid config saved`, {type: "info"});
    }

    changeBotState = async (state) => {
        this.setState({buttonDisable: true});
        await ApiHelper.changeBotState(this.state.channelId, state);
        toast(`Bot ${state} successful`, {type: "info"});
    }

    onConfigChange = async (event, configItem) => {
        let config = {...this.state.config};
        config[configItem] = event.target.checked;
        await ApiHelper.updateBotConfig(this.state.channelId, config);
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
                <h3>Current State</h3>
                <div style={{marginLeft: "10px"}}>
                    <div style={{display: "table"}}>
                        <div style={{display: "table-row"}}>
                            <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Created:</div>
                            <div style={{display: "table-cell", padding: "10px"}}>{this.state.botState.created ? "Yes" : "No"}</div>
                        </div>
                        <div style={{display: "table-row"}}>
                            <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Running:</div>
                            <div style={{display: "table-cell", padding: "10px"}}>{this.state.botState.running ? "Yes" : "No"}</div>
                        </div>
                    </div>
                </div>
                <h3>Twitch Bot User Link</h3>
                <p>If you wish to register a user other than your Twitch channel's user as your bot account, you can click below to register that user.</p>
                <div style={{marginLeft: "10px"}}>
                    <div style={{display: "table"}}>
                        <div style={{display: "table-row"}}>
                            <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Bot User:</div>
                            <div style={{display: "table-cell", padding: "10px"}}>{this.state.botConfig.botUser.twitchUser}</div>
                        </div>
                    </div>
                    <a href={twitchBotAddUrl}>
                        <button>Change Twitch Bot User</button>
                    </a>
                </div>
                <h3>Panel URLs</h3>
                <p>Bring the below into your XSplit or OBS presentation layouts to show monsters and battle notifications.  It is recommended to place the encounter panel on either side of the screen, and the notification panel on the top or bottom of the screen.</p>
                <div style={{display: "table"}}>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Encounters Panel:</div>
                        <div style={{display: "table-cell", padding: "10px"}}><input type="text" value={`https://deusprogrammer.com/util/battle-panel/encounters?channelId=${this.state.channelId}`} style={{width: "700px"}} /></div>
                    </div>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Notifications Panel:</div>
                        <div style={{display: "table-cell", padding: "10px"}}><input type="text" value={`https://deusprogrammer.com/util/battle-panel/notifications?channelId=${this.state.channelId}`} style={{width: "700px"}} /></div>
                    </div>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Death Counter Panel:</div>
                        <div style={{display: "table-cell", padding: "10px"}}><input type="text" value={`https://deusprogrammer.com/util/twitch-tools/death-counter?channelId=${this.state.channelId}`} style={{width: "700px"}} /></div>
                    </div>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Request Panel:</div>
                        <div style={{display: "table-cell", padding: "10px"}}><input type="text" value={`https://deusprogrammer.com/util/twitch-tools/requests?channelId=${this.state.channelId}`} style={{width: "700px"}} /></div>
                    </div>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Soundboard:</div>
                        <div style={{display: "table-cell", padding: "10px"}}><input type="text" value={`https://deusprogrammer.com/util/twitch-tools/sound-player?channelId=${this.state.channelId}`} style={{width: "700px"}} /></div>
                    </div>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Animation Overlay:</div>
                        <div style={{display: "table-cell", padding: "10px"}}><input type="text" value={`https://deusprogrammer.com/util/twitch-tools/multi?channelId=${this.state.channelId}`} style={{width: "700px"}} /></div>
                    </div>
                </div>
                <h3>Stand Alone Panels</h3>
                <div style={{marginLeft: "10px"}}>
                    <a target="_blank" href={`https://deusprogrammer.com/util/twitch-tools/wtd?channelId=${this.state.channelId}`}><button type="button">What the Dub</button></a><br />
                    <a target="_blank" href={`https://deusprogrammer.com/util/twitch-tools/tts?channelId=${this.state.channelId}`}><button type="button">Text to Speech</button></a>
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