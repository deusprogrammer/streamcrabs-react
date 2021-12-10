import React from 'react';

import ApiHelper from '../utils/ApiHelper';

export default class RegistrationBotUserCallBack extends React.Component {
    state = {
        error: false,
        ready: false
    }

    componentDidMount = async () => {
        document.title = `Bot User Registration`;
        let queryParam = new URLSearchParams(window.location.search);
        try {
            await ApiHelper.registerBotUser(queryParam.get("code"));
            this.setState({ready: true});
            window.location = "https://deusprogrammer.com/util/twitch/config/bot";
        } catch (error) {
            this.setState({error: true});
        }
    }
    
    render() {
        if (this.state.error) {
            return (
                <div>
                    <h1>Error Registering Bot User</h1>
                    <p>We were unable to register your bot user.  Please contact deusprogrammer@gmail.com for assistance.</p>
                </div>
            )
        }

        return (
            <div>
                <h1>Hold on...we are registering your bot right now.</h1>
            </div>
        )
    }
}