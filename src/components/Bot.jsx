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
                <h3>Bot Information</h3>
                <div style={{display: "table"}}>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Twitch Channel Id:</div>
                        <div style={{display: "table-cell", padding: "10px"}}>{this.props.channel}</div>
                    </div>
                </div>
                <h3>Panel URLs</h3>
                <p>Bring the below into your XSplit or OBS presentation layouts to show monsters and battle notifications.  It is recommended to place the encounter panel on either side of the screen, and the notification panel on the top or bottom of the screen.</p>
                <div style={{display: "table"}}>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>CBD Encounters Panel:</div>
                        <div style={{display: "table-cell", padding: "10px", backgroundColor: "white", color: "black", border: "1px solid gray"}}>{`https://deusprogrammer.com/util/battle-panel/encounters?channelId=${this.props.channel}`}</div>
                    </div>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Soundboard:</div>
                        <div style={{display: "table-cell", padding: "10px", backgroundColor: "white", color: "black", border: "1px solid gray"}}>{`https://deusprogrammer.com/util/twitch-tools/overlays/sound-player?channelId=${this.props.channel}`}</div>
                    </div>
                    <div style={{display: "table-row"}}>
                        <div style={{display: "table-cell", padding: "10px", fontWeight: "bolder"}}>Animation Overlay:</div>
                        <div style={{display: "table-cell", padding: "10px", backgroundColor: "white", color: "black", border: "1px solid gray"}}>{`https://deusprogrammer.com/util/twitch-tools/overlays/multi?channelId=${this.props.channel}`}</div>
                    </div>
                </div>
                <h3>Stand Alone Panels</h3>
                <div style={{marginLeft: "10px"}}>
                    <a target="_blank" href={`https://deusprogrammer.com/util/twitch-tools/wtd?channelId=${this.props.channel}`}><button type="button">What the Dub</button></a><br />
                    <a target="_blank" href={`https://deusprogrammer.com/util/twitch-tools/tts?channelId=${this.props.channel}`}><button type="button">Text to Speech</button></a>
                </div>
            </div>
        )
    }
}