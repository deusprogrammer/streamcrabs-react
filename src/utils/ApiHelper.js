import axios from 'axios';
import config from '../config/config';

const createBot = async (twitchAuthCode) => {
    let url = `${config.BASE_URL}/bots`;

    let res = await axios.post(url, {
        twitchAuthCode
    })

    return res.data;
}

const registerBotUser = async (channel, twitchAuthCode) => {
    let url = `${config.BASE_URL}/bots/${channel}/bot-user`;

    let res = await axios.post(url, {
        twitchAuthCode
    }, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    })

    return res.data;
}

const checkToken = async (channel) => {
    let url = `${config.BASE_URL}/bots/${channel}/token`;

    let res = await axios.get(url, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return res.data;
}

const updateToken = async (channel, twitchAuthCode) => {
    let url = `${config.BASE_URL}/bots/${channel}/token`;

    let res = await axios.put(url, {
        twitchAuthCode
    },{
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return res.data;
}

const getBot = async (channel) => {
    let url = `${config.BASE_URL}/bots/${channel}`;

    let res = await axios.get(url, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return res.data;
}

const getBotState = async (channel) => {
    let url = `${config.BASE_URL}/bots/${channel}/state`;

    let res = await axios.get(url, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return res.data;
}

const getAllMedia = async (extension) => {
    let url = `${config.MEDIA_SERVER_URL}/media?extension=${extension}`;

    let res = await axios.get(url);

    return res.data;
}

const getMedia = async (id, mimeType) => {
    let url = `${config.MEDIA_SERVER_URL}/media/${id}`;

    let res = await axios.get(url, {
        headers: {
            "Accept": mimeType
        }
    });

    return res.data;
}

const getMediaMetaData = async (id) => {
    let url = `${config.MEDIA_SERVER_URL}/media/${id}`;

    let res = await axios.get(url, {
        headers: {
            "Accept": "application/json"
        }
    });

    return res.data;
}

const storeMedia = async (mediaObject) => {
    let url = `${config.MEDIA_SERVER_URL}/media`;

    let res = await axios.post(url, mediaObject, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return res.data;
}

const changeBotState = async (channel, newState) => {
    let res = await axios.put(`${config.BASE_URL}/bots/${channel}/state`, {
        newState
    }, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    })

    return res.data;
}

const updateBotConfig = async (channelId, configData) => {
    let updated = await axios.put(`${config.BASE_URL}/bots/${channelId}/config`, configData, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return updated.data;
}

const getBotConfig = async (channelId) => {
    let found = await axios.get(`${config.BASE_URL}/bots/${channelId}/config`, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return found.data;
}

const updateBotMediaPool = async (channelId, poolType, pool) => {
    let updated = await axios.put(`${config.BASE_URL}/bots/${channelId}/media/${poolType}`, pool, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return updated.data;
}

const storeDynamicAlert = async (raidAlert) => {
    let created = await axios.post(`${config.BASE_URL}/dynamic-alerts/`, raidAlert, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return created.data;
}

const updateDynamicAlert = async (id, raidAlert) => {
    let updated = await axios.put(`${config.BASE_URL}/dynamic-alerts/${id}`, raidAlert, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return updated.data;
}

const getDynamicAlert = async (id) => {
    let found = await axios.get(`${config.BASE_URL}/dynamic-alerts/${id}`, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return found.data;
}

const getDynamicAlerts = async (channel) => {
    let found = await axios.get(`${config.BASE_URL}/dynamic-alerts?twitchChannel=${channel}`, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return found.data;
}

const updateRaidAlertConfig = async (channel, newConfig) => {
    let update = await axios.put(`${config.BASE_URL}/bots/${channel}/raid-config`, newConfig, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return update.data;
}

const updateAlertConfig = async (channel, alertConfigs) => {
    let update = await axios.put(`${config.BASE_URL}/bots/${channel}/alerts`, alertConfigs, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return update.data;
}

const updateCommands = async (channel, commands) => {
    let update = await axios.put(`${config.BASE_URL}/bots/${channel}/commands`, commands, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return update.data;
}

const updateRedemptions = async (channel, redemptions) => {
    let update = await axios.put(`${config.BASE_URL}/bots/${channel}/redemptions`, redemptions, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return update.data;
}

const updateGauges = async (channel, gauges) => {
    let update = await axios.put(`${config.BASE_URL}/bots/${channel}/gauges`, gauges, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return update.data;
}

const getAdminConfigs = async () => {
    let found = await axios.get(`${config.BASE_URL}/configs`, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return found.data;
}

const updateAdminConfigs = async (newConfig) => {
    let update = await axios.put(`${config.BASE_URL}/configs/${newConfig.name}`, newConfig, {
        headers: {
            "X-Access-Token": localStorage.getItem("accessToken")
        }
    });

    return update.data;
}

const createChannelPointReward = async (channel, title, cost, botConfig) => {
    let {data: {data: rewards}} = await axios.post(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${channel}`, {
        title,
        cost
    }, {
        headers: {
            'content-type': 'application/json',
            'client-id': process.env.REACT_APP_TWITCH_CLIENT_ID,
            'authorization': `Bearer ${botConfig.accessToken}`
        }
    });

    return rewards;
}

const removeChannelPointReward = async (channel, id, botConfig) => {
    let {data: {data: rewards}} = await axios.delete(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${channel}&id=${id}`, {
        headers: {
            'content-type': 'application/json',
            'client-id': process.env.REACT_APP_TWITCH_CLIENT_ID,
            'authorization': `Bearer ${botConfig.accessToken}`
        }
    });

    return rewards;
}

const getChannelPointRewards = async (channel, botConfig) => {
    let {data: {data: rewards}} = await axios.get(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=${channel}`, {
        headers: {
            'content-type': 'application/json',
            'client-id': process.env.REACT_APP_TWITCH_CLIENT_ID,
            'authorization': `Bearer ${botConfig.accessToken}`
        }
    });

    return rewards;
}

export default {
    storeDynamicAlert,
    updateDynamicAlert,
    updateAlertConfig,
    updateCommands,
    updateRedemptions,
    updateGauges,
    getDynamicAlerts,
    getDynamicAlert,
    updateRaidAlertConfig,
    createBot,
    registerBotUser,
    checkToken,
    updateToken,
    getBot,
    getBotState,
    getAllMedia,
    getMedia,
    getMediaMetaData,
    storeMedia,
    changeBotState,
    updateBotConfig,
    getBotConfig,
    updateBotMediaPool,
    getAdminConfigs,
    updateAdminConfigs,
    createChannelPointReward,
    getChannelPointRewards,
    removeChannelPointReward
}