import React from 'react';
import {ToastContainer} from 'react-toastify';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import axios from 'axios';

import Home from './components/Home';
import About from './components/About';
import Bot from './components/Bot';
import RegistrationStart from './components/RegistrationStart';
import RegistrationCallBack from './components/RegistrationCallBack';
import RegistrationRefresh from './components/RegistrationRefresh';
import MediaPoolConfig from './components/MediaPoolConfig';
import DynamicAlertCustomizer from './components/DynamicAlertCustomizer';
import DynamicAlertManager from './components/DynamicAlertManager';
import AlertConfig from './components/AlertConfig';
import CommandConfig from './components/CommandConfig';
import Whitelist from './components/Whitelist';
import GettingStarted from './components/GettingStarted';

import SecureRoute from './elements/SecureRoute';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import Dev from './devComponents/Dev';

class App extends React.Component {
    state = {
        isLoggedIn: false,
        isAdmin: false,
        profile: {},
        channel: window.localStorage.getItem("channel")
    }

    login = () => {
        if (process.env.NODE_ENV === "development") {
            window.location = `https://deusprogrammer.com/util/auth/dev?redirect=${window.location.protocol}//${window.location.hostname}:${window.location.port}${process.env.PUBLIC_URL}/dev`;
            return;
        }
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

        let channel = this.state.channel;
        if (!profile.connected.twitch.channels.includes(this.state.channel)) {
            console.log("Selected channel wasn't in list of connected channels");
            window.localStorage.setItem("channel", profile.connected.twitch.channels.length > 0 ? profile.connected.twitch.channels[0] : null);
            channel = window.localStorage.getItem("channel");
        }

        let isLoggedIn = true;
        let isAdmin = false;
        let isBroadcaster = false;
        if (profile.roles.includes("TWITCH_ADMIN")) {
            isAdmin = true;
        }

        if (profile.roles.includes("TWITCH_BROADCASTER")) {
            isBroadcaster = true;
        }

        if (profile.username === null) {
            isLoggedIn = false;
        }

        this.setState({isLoggedIn, isAdmin, isBroadcaster, profile, channel});
    }
    
    render() {
        let menu;

        if (this.state.isAdmin) {
            menu = (
                <React.Fragment>
                    <Link to={`${process.env.PUBLIC_URL}/about`}>About</Link> | <Link to={`${process.env.PUBLIC_URL}/guide`}>Getting Started</Link><br/>
                    <Link to={`${process.env.PUBLIC_URL}/`}>Bot</Link> | <Link to={`${process.env.PUBLIC_URL}/overlays`}>Overlays</Link> | <Link to={`${process.env.PUBLIC_URL}/configs/media`}>Media Pool</Link> | <Link to={`${process.env.PUBLIC_URL}/configs/commands`}>Commands</Link> | <Link to={`${process.env.PUBLIC_URL}/configs/alerts`}>Alert Config</Link> | <Link to={`${process.env.PUBLIC_URL}/configs/raid-alerts`}>Dynamic Alerts</Link><br/>
                    <Link to={`${process.env.PUBLIC_URL}/admin/whitelist`}>Whitelist</Link>
                </React.Fragment>
            );
        } else if (this.state.isBroadcaster) {
            menu = (
                <React.Fragment>
                    <Link to={`${process.env.PUBLIC_URL}/about`}>About</Link> | <Link to={`${process.env.PUBLIC_URL}/guide`}>Getting Started</Link> | <Link to={`${process.env.PUBLIC_URL}/about`}>About</Link><br/>
                    <Link to={`${process.env.PUBLIC_URL}/`}>Bot</Link> | <Link to={`${process.env.PUBLIC_URL}/overlays`}>Overlays</Link> | <Link to={`${process.env.PUBLIC_URL}/configs/media`}>Media Pool</Link> | <Link to={`${process.env.PUBLIC_URL}/configs/commands`}>Commands</Link> | <Link to={`${process.env.PUBLIC_URL}/configs/alerts`}>Alert Config</Link> | <Link to={`${process.env.PUBLIC_URL}/configs/raid-alerts`}>Dynamic Alerts</Link>
                </React.Fragment>
            );
        } else {
            menu = (
                <React.Fragment>
                    <Link to={`${process.env.PUBLIC_URL}/about`}>About</Link> | <Link to={`${process.env.PUBLIC_URL}/registration/start`}>Get a Bot</Link>
                </React.Fragment>
            );
        }

        return (
            <div style={{margin: "auto"}}>
                <ToastContainer />
                <Router>
                    <div style={{textAlign: "right"}}>
                        {!this.state.isLoggedIn ? 
                            <button onClick={this.login}>Login</button> : <span>Logged in as {this.state.profile.username}{this.state.isAdmin ? "[ADMIN]" : null}</span>
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
                                    window.location.reload();
                                }}>
                                { this.state.profile.connected.twitch.channels.map((channel) => {
                                    return (
                                        <option key={channel} value={channel}>{channel}</option>
                                    );
                                })}
                            </select>
                        </div> : null
                    }
                    <Switch>
                        { this.state.isLoggedIn ?
                            <Route exact path={`${process.env.PUBLIC_URL}/`} render={(props) => {return <Home {...props} channel={this.state.channel} />}} /> :
                            <Route exact path={`${process.env.PUBLIC_URL}/`} component={About} />
                        }
                        <Route exact path={`${process.env.PUBLIC_URL}/about`} component={About} />
                        <Route exact path={`${process.env.PUBLIC_URL}/guide`} component={GettingStarted} />
                        
                        <Route exact path={`${process.env.PUBLIC_URL}/registration/start`} component={RegistrationStart} />
                        <Route exact path={`${process.env.PUBLIC_URL}/registration/callback`} component={RegistrationCallBack} />
                        <Route exact path={`${process.env.PUBLIC_URL}/registration/refresh`} component={RegistrationRefresh} />
                        
                        <SecureRoute isAuthenticated={this.state.isBroadcaster} exact path={`${process.env.PUBLIC_URL}/overlays`} render={(props) => {return <Bot {...props} channel={this.state.channel} />}} />
                        <SecureRoute isAuthenticated={this.state.isBroadcaster} exact path={`${process.env.PUBLIC_URL}/configs/alerts`} render={(props) => {return <AlertConfig {...props} channel={this.state.channel} />}} />
                        <SecureRoute isAuthenticated={this.state.isBroadcaster} exact path={`${process.env.PUBLIC_URL}/configs/commands`} render={(props) => {return <CommandConfig {...props} channel={this.state.channel} />}} />
                        <SecureRoute isAuthenticated={this.state.isBroadcaster} exact path={`${process.env.PUBLIC_URL}/configs/media`} render={(props) => {return <MediaPoolConfig {...props} channel={this.state.channel} />}} />
                        <SecureRoute isAuthenticated={this.state.isBroadcaster} exact path={`${process.env.PUBLIC_URL}/configs/raid-alert`} render={(props) => {return <DynamicAlertCustomizer {...props} channel={this.state.channel} />}} />
                        <SecureRoute isAuthenticated={this.state.isBroadcaster} exact path={`${process.env.PUBLIC_URL}/configs/raid-alert/:id`} render={(props) => {return <DynamicAlertCustomizer {...props} channel={this.state.channel} />}} />
                        <SecureRoute isAuthenticated={this.state.isBroadcaster} exact path={`${process.env.PUBLIC_URL}/configs/raid-alerts`} render={(props) => {return <DynamicAlertManager {...props} channel={this.state.channel} />}} />
                        
                        <SecureRoute isAuthenticated={this.state.isAdmin} exact path={`${process.env.PUBLIC_URL}/admin/whitelist`} render={() => {return <Whitelist channel={this.state.channel} />}} />
                    
                        { process.env.NODE_ENV === 'development' ?
                            <Route exact path={`${process.env.PUBLIC_URL}/dev`} component={Dev} /> : null
                        }
                    </Switch>
                </Router>
            </div>
    );
    }
}

export default App;
