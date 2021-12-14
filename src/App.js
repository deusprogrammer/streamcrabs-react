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
import DynamicAlertCustomizer from './components/DynamicAlertCustomizer';
import DynamicAlertManager from './components/DynamicAlertManager';
import AlertConfig from './components/AlertConfig';
import CommandConfig from './components/CommandConfig';
import Whitelist from './components/Whitelist';

import SecureRoute from './elements/SecureRoute';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
    state = {
        isAdmin: false,
        profile: {},
        channel: window.localStorage.getItem("channel")
    }

    login = () => {
        window.localStorage.setItem("twitchRedirect", "https://deusprogrammer.com/streamcrabs");
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
        if (profile.roles.includes("TWITCH_ADMIN")) {
            isAdmin = true;
        }

        if (profile.roles.includes("TWITCH_BROADCASTER")) {
            isBroadcaster = true;
        }

        this.setState({isLoggedIn, isAdmin, isBroadcaster, profile});
    }
    
    render() {
        let menu;

        if (this.state.isBroadcaster) {
            menu = (
                <React.Fragment>
                    <Link to={`${process.env.PUBLIC_URL}/configs/bot`}>Bot</Link> | <Link to={`${process.env.PUBLIC_URL}/configs/media`}>Media Pool</Link> | <Link to={`${process.env.PUBLIC_URL}/configs/commands`}>Commands</Link> | <Link to={`${process.env.PUBLIC_URL}/configs/alerts`}>Alert Config</Link> | <Link to={`${process.env.PUBLIC_URL}/configs/raid-alerts`}>Dynamic Alerts</Link>
                </React.Fragment>
            );
        } else if (this.state.isAdmin) {
            menu = (
                <React.Fragment>
                    <Link to={`${process.env.PUBLIC_URL}/configs/bot`}>Bot</Link> | <Link to={`${process.env.PUBLIC_URL}/configs/media`}>Media Pool</Link> | <Link to={`${process.env.PUBLIC_URL}/configs/commands`}>Commands</Link> | <Link to={`${process.env.PUBLIC_URL}/configs/alerts`}>Alert Config</Link> | <Link to={`${process.env.PUBLIC_URL}/configs/raid-alerts`}>Dynamic Alerts</Link><br/>
                    <Link to={`${process.env.PUBLIC_URL}/admin/whitelist`}>Whitelist</Link>
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
                            <button onClick={this.login}>Login</button> : <span>Logged in as {this.state.profile.username}</span>
                        }
                    </div>
                    <div style={{textAlign: "center"}}>
                        {menu}
                    </div>
                    {this.state.isBroadcaster ?
                        <div style={{textAlign: "center"}}>
                            <label>Channel:</label>
                            <select 
                                value={this.state.channel}
                                onChange={(evt) => {
                                    this.setState({channel: evt.target.value});
                                    window.localStorage.setItem("channel", evt.target.value);
                                }}>
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
                        <Route exact path={`${process.env.PUBLIC_URL}/registration/refresh`} component={RegistrationRefresh} />
                        
                        <SecureRoute isAuthenticated={this.state.isBroadcaster} exact path={`${process.env.PUBLIC_URL}/configs/bot`} render={() => {return <Bot channel={this.state.channel} />}} />
                        <SecureRoute isAuthenticated={this.state.isBroadcaster} exact path={`${process.env.PUBLIC_URL}/configs/alerts`} render={() => {return <AlertConfig channel={this.state.channel} />}} />
                        <SecureRoute isAuthenticated={this.state.isBroadcaster} exact path={`${process.env.PUBLIC_URL}/configs/commands`} render={() => {return <CommandConfig channel={this.state.channel} />}} />
                        <SecureRoute isAuthenticated={this.state.isBroadcaster} exact path={`${process.env.PUBLIC_URL}/configs/media`} render={() => {return <MediaPoolConfig channel={this.state.channel} />}} />
                        <SecureRoute isAuthenticated={this.state.isBroadcaster} exact path={`${process.env.PUBLIC_URL}/configs/raid-alert`} render={() => {return <DynamicAlertCustomizer channel={this.state.channel} />}} />
                        <SecureRoute isAuthenticated={this.state.isBroadcaster} exact path={`${process.env.PUBLIC_URL}/configs/raid-alert/:id`} render={() => {return <DynamicAlertCustomizer channel={this.state.channel} />}} />
                        <SecureRoute isAuthenticated={this.state.isBroadcaster} exact path={`${process.env.PUBLIC_URL}/configs/raid-alerts`} render={() => {return <DynamicAlertManager channel={this.state.channel} />}} />
                        
                        {/* <SecureRoute isAuthenticated={this.state.isAdmin} exact path={`${process.env.PUBLIC_URL}/admin/configs`} component={AdminConfigs} /> */}
                        <SecureRoute isAuthenticated={this.state.isAdmin} exact path={`${process.env.PUBLIC_URL}/admin/whitelist`} render={() => {return <Whitelist channel={this.state.channel} />}} />
                    </Switch>
                </Router>
            </div>
    );
    }
}

export default App;
