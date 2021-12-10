import React from 'react';
import {ToastContainer} from 'react-toastify';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import axios from 'axios';

import Bot from './components/Bot';
import RegistrationStart from './components/RegistrationStart';
import RegistrationCallBack from './components/RegistrationCallBack';
import RegistrationRefresh from './components/RegistrationRefresh';
import AdminConfigs from './components/AdminConfigs';
import MediaPoolConfig from './components/MediaPoolConfig';
import RaidAlertCustomizer from './components/RaidAlertCustomizer';
import RaidAlertManager from './components/RaidAlertManager';

import SecureRoute from './elements/SecureRoute';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import RegistrationBotUserCallBack from './components/RegistrationBotUserCallBack';


class App extends React.Component {
    state = {
        isAdmin: false,
        channel: window.localStorage.getItem("channel")
    }

    login = () => {
        window.localStorage.setItem("twitchRedirect", "https://deusprogrammer.com/util/twitch/");
        window.location.replace("https://deusprogrammer.com/api/auth-svc/auth/twitch");
    }

    componentDidMount = async () => {
        // If no access token is present, don't retrieve their information
        if (!localStorage.getItem("accessToken")) {
            return;
        }

        let res = await axios.get(`https://deusprogrammer.com/api/profile-svc/users/~self`, {
            headers: {
                "X-Access-Token": localStorage.getItem("accessToken")
            }
        });

        let profile = res.data;

        window.localStorage.setItem("channel", profile.connected.twitch.channels.length > 0 ? profile.connected.twitch.channels[0] : null);

        let isLoggedIn = true;
        let isAdmin = false;
        let isBroadcaster = false;
        if (profile.roles.includes("TWITCH_BROADCASTER")) {
            isAdmin = true;
        }

        if (profile.roles.includes("TWITCH_BROADCASTER")) {
            isBroadcaster = true;
        }

        this.setState({isLoggedIn, isAdmin, isBroadcaster, profile});
    }
    
    render() {
        let menu;

        if (this.state.isAdmin) {
            menu = (
                <React.Fragment>
                    <Link to={`${process.env.PUBLIC_URL}/configs/bot`}>Bot</Link> |
                    <Link to={`${process.env.PUBLIC_URL}/configs/media`}>Media Pool</Link> |
                    <Link to={`${process.env.PUBLIC_URL}/configs/bot`}>Commands</Link> |
                    <Link to={`${process.env.PUBLIC_URL}/configs/bot`}>Alert Config</Link> |
                    <Link to={`${process.env.PUBLIC_URL}/configs/raid-alerts`}>Dynamic Alerts</Link>
                </React.Fragment>
            );
        } else {
            menu = (
                <React.Fragment>
                    <Link to={`${process.env.PUBLIC_URL}/registration/start`}>Get a Bot</Link>
                </React.Fragment>
            );
        }

        return (
            <div style={{margin: "auto"}}>
                <ToastContainer />
                <Router>
                    <div style={{textAlign: "right"}}>
                        {!this.state.isLoggedIn ? 
                            <button onClick={this.login}>Login</button> : <button onClick={() => {alert("This is not currently implemented")}}>My Profile</button>
                        }
                    </div>
                    <div style={{textAlign: "center"}}>
                        {menu}
                    </div>
                    {this.state.isAdmin ?
                        <div style={{textAlign: "center"}}>
                            <label>Channel:</label>
                            <select 
                                value={this.state.channel}
                                onChange={(evt) => {window.localStorage.setItem("channel", evt.target.value); window.location.reload();}}>
                                { this.state.profile.connected.twitch.channels.map((channel) => {
                                    return (
                                        <option value={channel}>{channel}</option>
                                    );
                                })}
                            </select>
                        </div> : null
                    }
                    <Switch>
                        <Route exact path={`${process.env.PUBLIC_URL}/registration/start`} component={RegistrationStart} />
                        <Route exact path={`${process.env.PUBLIC_URL}/registration/callback`} component={RegistrationCallBack} />
                        <Route exact path={`${process.env.PUBLIC_URL}/registration/registerBotUser`} component={RegistrationBotUserCallBack} />
                        <Route exact path={`${process.env.PUBLIC_URL}/registration/refresh`} component={RegistrationRefresh} />
                        
                        <SecureRoute isAuthenticated={this.state.isBroadcaster || this.state.isAdmin} exact path={`${process.env.PUBLIC_URL}/configs/bot`} component={Bot} />
                        <SecureRoute isAuthenticated={this.state.isBroadcaster || this.state.isAdmin} exact path={`${process.env.PUBLIC_URL}/configs/media`} component={MediaPoolConfig} />
                        <SecureRoute isAuthenticated={this.state.isBroadcaster || this.state.isAdmin} exact path={`${process.env.PUBLIC_URL}/configs/raid-alert`} component={RaidAlertCustomizer} />
                        <SecureRoute isAuthenticated={this.state.isBroadcaster || this.state.isAdmin} exact path={`${process.env.PUBLIC_URL}/configs/raid-alert/:id`} component={RaidAlertCustomizer} />
                        <SecureRoute isAuthenticated={this.state.isBroadcaster || this.state.isAdmin} exact path={`${process.env.PUBLIC_URL}/configs/raid-alerts`} component={RaidAlertManager} />
                        <SecureRoute isAuthenticated={this.state.isAdmin} exact path={`${process.env.PUBLIC_URL}/admin/configs`} component={AdminConfigs} />
                    </Switch>
                </Router>
            </div>
    );
    }
}

export default App;
