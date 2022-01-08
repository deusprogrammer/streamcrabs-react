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
    const [rewards, setRewards] = useState([]);
    const [config, setConfig] = useState({});
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

    return (
        <div>
            <h1>Channel Point Rewards</h1>
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