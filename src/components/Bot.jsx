import React, {useState, useEffect} from 'react';
import ApiHelper from '../utils/ApiHelper';

import axios from 'axios';

const twitchAuthUrl = "https://id.twitch.tv/oauth2/authorize?client_id=uczfktv6o7vvdeqxnafizuq672r5od&redirect_uri=https://deusprogrammer.com/streamcrabs/registration/refresh&response_type=code&scope=chat:read%20chat:edit%20channel:read:redemptions%20channel:read:subscriptions%20bits:read";

const configElementDescriptions = {
    cbd: "Chat Battle Dungeon",
    requests: "Request Queue",
    rewards: "Rewards"
}

const Bot = (props) => {
    const [botStarted, setBotStarted] = useState(false);
    const [featureConfig, setFeatureConfig] = useState({
        cbd: false,
        requests: false,
        rewards: false
    });
    const [configLoaded, setConfigLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            let botState = await ApiHelper.getBotState(props.channel);
            let config = await ApiHelper.getBotConfig(props.channel);

            Object.keys(featureConfig).forEach((key) => {
                if (!config[key]) {
                    config[key] = false;
                }
            });
        
            // Get profile
            let {data: profile} = await axios.get(`https://deusprogrammer.com/api/profile-svc/users/~self`, {
                headers: {
                    "X-Access-Token": localStorage.getItem("accessToken")
                }
            });

            const isChannelOwner = profile.connected && profile.connected.twitch && profile.connected.twitch.userId === props.channel;

            // Check token state and update it if you are the channel owner and the token is invalid.
            let tokenState = await ApiHelper.checkToken(props.channel);
            if (!tokenState.valid && isChannelOwner) {
                window.location.replace(twitchAuthUrl);
                return;
            }

            setBotStarted(botState.running);
            setFeatureConfig(config);
            setConfigLoaded(true);

            const interval = setInterval(async () => {
                tokenState = await ApiHelper.checkToken(props.channel);
                botState = await ApiHelper.getBotState(props.channel);
                
                setBotStarted(botState.running);
    
                if (!tokenState.valid && isChannelOwner) {
                    window.location.replace(twitchAuthUrl);
                    return;
                }
            }, 5000);

            return () => {
                clearInterval(interval);
            }
        })();
    }, []);

    const startBot = async () => {
        await ApiHelper.changeBotState(props.channel, "start");
        setBotStarted(true);
    }

    const stopBot = async () => {
        await ApiHelper.changeBotState(props.channel, "stop");
        setBotStarted(false);
    }

    const updateConfig = async (event, configItem) => {
        let config = {...featureConfig};
        config[configItem] = event.target.checked;
        await ApiHelper.updateBotConfig(props.channel, config);
        setFeatureConfig(config);
    }

    if (!configLoaded) {
        return (
            <div style={{position: "absolute", width: "100vw", top: "50%", left: "0px", transform: "translateY(-50%)", textAlign: "center"}}>
                Loading Bot Config
            </div>
        )
    }

    return (
        <div style={{width: "80%", margin: "auto"}}>
            <div style={{textAlign: "center"}}>
                <img style={{width: "300px"}} src={`${process.env.PUBLIC_URL}/streamcrab.png`} />
            </div>
            <h2>Bot Configuration</h2>
            <div>
                <b>Twitch Channel Id:</b>{props.channel}
            </div>
            <div>
                <b>Config:</b>
                <div style={{marginLeft: "10px"}}>
                { Object.keys(configElementDescriptions).map((configElement) => {
                    let configElementValue = featureConfig[configElement];
                    let configElementDescription = configElementDescriptions[configElement];
                    return (
                        <React.Fragment key={configElement}>
                            <input type="checkbox" onChange={(e) => {updateConfig(e, configElement)}} checked={configElementValue} disabled={botStarted} />&nbsp;<label>{configElementDescription}</label><br/>
                        </React.Fragment>
                    )
                })}
                </div>
            </div>
            <div style={{textAlign: "center"}}>
                {!botStarted ? 
                    <button style={{width: "200px", height: "100px", fontSize: "20pt", background: "green", color: "white"}} onClick={startBot}>Start Bot</button> 
                    :
                    <button style={{width: "200px", height: "100px", fontSize: "20pt", background: "red", color: "white"}} onClick={stopBot}>Stop Bot</button>
                }
            </div>
        </div>
    )
};

export default Bot;