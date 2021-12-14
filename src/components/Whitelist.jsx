import React, {useState, useEffect} from 'react';

import axios from 'axios';

import ApiHelper from '../utils/ApiHelper';

const TWITCH_GET_USERS_URI = 'https://api.twitch.tv/helix/users';
const TWITCH_CLIENT_ID = 'uczfktv6o7vvdeqxnafizuq672r5od';

const getTwitchUserDetails = async (userIds, clientId, accessToken) => {
    let sep = '?';
    let queryParams = '';
    for (let userId of userIds) {
        queryParams += sep + `id=${userId}`;
        sep = '&';
    }

    let {data} = await axios.get(`${TWITCH_GET_USERS_URI}${queryParams}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Client-Id': clientId
        }});

    return data;
}

export default (props) => {
    const [whitelistedUsers, setWhitelistedUsers] = useState([]);

    useEffect(() => {
        (async () => {
            let botConfig = await ApiHelper.getBot(props.channel);
            let configs = await ApiHelper.getAdminConfigs();
            let allowedUsers = configs.find(config => config.name === "allowedBots");
            let twitchUsers = await getTwitchUserDetails(allowedUsers.values, TWITCH_CLIENT_ID, botConfig.accessToken);
            setWhitelistedUsers(twitchUsers.data);
        })();
    }, []);

    return (
        <div>
            <div>
                <label>Search</label>
                <input type="text" />
                <button>Add</button>
            </div>
            <div>
                {whitelistedUsers.map((whitelistedUser) => {
                    return (
                        <div>
                            <div><img src={whitelistedUser.profile_image_url} /></div>
                            <div>{whitelistedUser.login}</div>
                        </div>);
                })}
            </div>
        </div>
    )
}