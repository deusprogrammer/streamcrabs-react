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
    const [searchUser, setSearchUser] = useState(null);

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

    const addUserToWhitelist = async (newUser) => {
        let updatedList = [...whitelistedUsers, newUser];
        setWhitelistedUsers(updatedList);
        setSearchUser(null);
        setSearchUserString("");
        await ApiHelper.updateAdminConfigs({
            name: "allowedBots",
            values: updatedList.map((user) => {
                return user.id;
            })
        });
    }

    const removeUserFromWhitelist = async (removeUser) => {
        let updatedList = whitelistedUsers.filter(user => user.id !== removeUser.id);
        setWhitelistedUsers(updatedList);
        await ApiHelper.updateAdminConfigs({
            name: "allowedBots",
            values: updatedList.map((user) => {
                return user.id;
            })
        });
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
                        <div style={{width: "100px"}}><img src={searchUser.profile_image_url} /></div>
                        <div style={{width: "200px"}}>{searchUser.login}</div>
                        <div><button onClick={() => {addUserToWhitelist(searchUser)}}>Add</button></div>
                    </div> : null
                }
            </div>
            <hr />
            <div>
                {whitelistedUsers.map((whitelistedUser) => {
                    return (
                        <div className="whitelist-entry">
                            <div style={{width: "100px"}}><img src={whitelistedUser.profile_image_url} /></div>
                            <div style={{width: "200px"}}>{whitelistedUser.login}</div>
                            <div><button onClick={() => {removeUserFromWhitelist(whitelistedUser)}}>Delete</button></div>
                        </div>);
                })}
            </div>
        </div>
    )
}