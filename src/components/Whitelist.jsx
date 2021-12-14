import React, {useState, useEffect} from 'react';

import axios from 'axios';

import ApiHelper from '../utils/ApiHelper';

const TWITCH_GET_USERS_URI = 'https://api.twitch.tv/helix/users';
const TWITCH_CLIENT_ID = 'uczfktv6o7vvdeqxnafizuq672r5od';

const getTwitchUserDetailsById = async (userIds, clientId, accessToken) => {
    let sep = '?';
    let queryParams = '';
    for (let userId of userIds) {
        queryParams += sep + `id=${userId}`;
        sep = '&';
    }

    try {
        let {data} = await axios.get(`${TWITCH_GET_USERS_URI}${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Client-Id': clientId
            }});

        return data;
    } catch (e) {
        return {data: []};
    }
}

const getTwitchUserDetailsByLogin = async (logins, clientId, accessToken) => {
    let sep = '?';
    let queryParams = '';
    for (let login of logins) {
        queryParams += sep + `login=${login}`;
        sep = '&';
    }

    try {
        let {data} = await axios.get(`${TWITCH_GET_USERS_URI}${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Client-Id': clientId
            }});

        return data;
    } catch (e) {
        return {data: []};
    }
}

export default (props) => {
    const [whitelistedUsers, setWhitelistedUsers] = useState([]);
    const [searchUserString, setSearchUserString] = useState("");
    const [botConfig, setBotConfig] = useState({});
    const [searchUser, setSearchUser] = useState({});

    useEffect(() => {
        (async () => {
            let botConfig = await ApiHelper.getBot(props.channel);
            let configs = await ApiHelper.getAdminConfigs();
            let allowedUsers = configs.find(config => config.name === "allowedBots");
            let twitchUsers = await getTwitchUserDetailsById(allowedUsers.values, TWITCH_CLIENT_ID, botConfig.accessToken);
            setWhitelistedUsers(twitchUsers.data);
            setBotConfig(botConfig);
        })();
    }, []);

    const userSearch = async (login) => {
        let searchUser = await getTwitchUserDetailsByLogin([login], TWITCH_CLIENT_ID, botConfig.accessToken);
        setSearchUser(searchUser.data[0]);
    }

    return (
        <div>
            <h1>User Whitelist</h1>
            <div>
                <input type="text" placeholder='Twitch Login' onChange={({target}) => {setSearchUserString(target.value)}} />
                <button onClick={() => {userSearch(searchUserString)}}>Search</button>
            </div>
            <div>
                {searchUser ? 
                    <div className="whitelist-entry">
                        <div><img src={searchUser.profile_image_url} /></div>
                        <div>{searchUser.login}</div>
                        <div><button>Add</button></div>
                    </div> : null
                }
            </div>
            <div>
                {whitelistedUsers.map((whitelistedUser) => {
                    return (
                        <div className="whitelist-entry">
                            <div><img src={whitelistedUser.profile_image_url} /></div>
                            <div>{whitelistedUser.login}</div>
                            <div><button>Delete</button></div>
                        </div>);
                })}
            </div>
        </div>
    )
}