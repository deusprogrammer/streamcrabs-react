import React, {useEffect, useState} from 'react';
import ApiHelper from '../utils/ApiHelper';

const rewardNames =  ["random sound", "random video", "bad apple", "bird up", "be a big shot"];
const rewardParams = {
    "random sound": {title: "Random Sound", cost: 100},
    "random video": {title: "Random Video", cost: 500},
    "bad apple": {title: "Bad Apple", cost: 2000},
    "bird up": {title: "Bird Up", cost: 200},
    "be a big shot": {title: "Be a Big Shot", cost: 10000}
}

export default (props) => {
    const [rewards, setRewards] = useState(null);
    const [config, setConfig] = useState(null);
    useEffect(() => {
        (async () => {
            let config = await ApiHelper.getBot(props.channel);
            let rewards = await ApiHelper.getChannelPointRewards(config.twitchChannelId, config);
            rewards = rewards.filter(reward => rewardNames.includes(reward.title.toLowerCase()))
            setRewards(rewards);
            setConfig(config);
        })();
    }, []);

    const removeReward = async (rewardId) => {
        await ApiHelper.removeChannelPointReward(config.twitchChannelId, rewardId, config);
        let rewards = await ApiHelper.getChannelPointRewards(config.twitchChannelId);
        rewards = rewards.filter(reward => rewardNames.includes(reward.title.toLowerCase()))
        setRewards(rewards);
    }

    const addReward = async (rewardName) => {
        await ApiHelper.createChannelPointReward(config.twitchChannelId, rewardParams[rewardName].title, rewardParams[rewardName].cost, config);
        let rewards = await ApiHelper.getChannelPointRewards(config.twitchChannelId, config);
        rewards = rewards.filter(reward => rewardNames.includes(reward.title.toLowerCase()))
        setRewards(rewards);
    }

    if (!rewards || !config) {
        return (
            <div style={{position: "absolute", width: "100vw", top: "50%", left: "0px", transform: "translateY(-50%)", textAlign: "center"}}>
                Loading Config...
            </div>
        )
    }

    return (
        <div>
            <h1>Channel Point Rewards</h1>
            <p>With this section you can add some premade channel point rewards to your channel that will trigger some neat things.  Eventually we will have custom rewards you can create yourself for anything from custom gagues to custom video/sound content.</p>
            <p>Random video and sound is sourced from your media pool.  Any item in your media pool that is checked will be included in the random selections of these rewards.</p>
            <h2>Standard Rewards</h2>
            <div style={{marginLeft: "20px"}}>
            {rewardNames.map((rewardName) => {
                let reward = rewards.find(reward => reward.title.toLowerCase() === rewardName)
                if (reward) {
                    return <React.Fragment key={`${rewardName}-remove`}><button onClick={() => {removeReward(reward.id)}}>Remove {rewardParams[rewardName].title}</button><br/></React.Fragment>
                } else {
                    return <React.Fragment key={`${rewardName}-add`}><button onClick={() => {addReward(rewardName)}}>Add {rewardParams[rewardName].title}</button><br/></React.Fragment>
                }
            })}
            </div>
            <h2>Custom Rewards</h2>
            <div style={{marginLeft: "20px"}}>
                Coming Soon
            </div>
        </div>
    )
}