import React, { useEffect, useState } from 'react';

import ApiHelper from '../utils/ApiHelper';

const AlertConfigElement = (props) => {
    let mediaSelector = null;
    switch (props.alertConfig.type) {
        case "VIDEO":
            mediaSelector = (
                <React.Fragment>
                    <td>Video:</td>
                    <td>
                        <select value={props.alertConfig.id} onChange={
                            ({target}) => {
                                props.alertConfig.id = target.value;
                                props.onChange(props.alertConfig);
                            }
                        }>
                            <option value="null">Choose Video...</option>
                            {props.botConfig.videoPool.map((video) => {
                                return <option value={video._id}>{video.name}</option>
                            })}
                        </select>
                    </td>
                </React.Fragment>);
            break;
        case "AUDIO":
            mediaSelector = (<React.Fragment>
                <td>Audio:</td>
                <td>
                    <select value={props.alertConfig.id} onChange={
                        ({target}) => {
                            props.alertConfig.id = target.value;
                            props.onChange(props.alertConfig);
                        }
                    }>
                        <option value="null">Choose Audio...</option>
                        {props.botConfig.audioPool.map((audio) => {
                            return <option value={audio._id}>{audio.name}</option>
                        })}
                    </select>
                </td>
            </React.Fragment>);
            break;
        case "DYNAMIC":
            mediaSelector = (<React.Fragment>
                <td>Dynamic:</td>
                <td>
                    <select value={props.alertConfig.id} onChange={
                        ({target}) => {
                            props.alertConfig.id = target.value;
                            props.onChange(props.alertConfig);
                        }
                    }>
                        <option value="null">Choose Dynamic...</option>
                        {props.dynamicAlerts.map((alert) => {
                            return <option value={alert._id}>{alert.name}</option>
                        })}
                    </select>
                </td>
            </React.Fragment>);
            break;
    }

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <td>Enabled:</td>
                        <td><input type="checkbox" checked={props.alertConfig.enabled} onChange={
                            ({target}) => {
                                props.alertConfig.enabled = target.checked;
                                props.onChange(props.alertConfig);
                            }
                        } /></td>
                    </tr>
                    <tr>
                        <td>Alert Type:</td>
                        <td>
                            <select value={props.alertConfig.type} onChange={
                                ({target}) => {
                                    props.alertConfig.type = target.value;
                                    props.onChange(props.alertConfig);
                                }
                            }>
                                <option value="VIDEO">Video</option>
                                <option value="AUDIO">Audio</option>
                                <option value="DYNAMIC">Dynamic</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        {mediaSelector}
                    </tr>
                    <tr>
                        <td>Message Template:</td>
                        <td>
                            <input style={{width: "300px"}} type="text" value={props.alertConfig.messageTemplate} onChange={({target}) => {
                                props.alertConfig.messageTemplate = target.value;
                                props.onChange(props.alertConfig);
                            }} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

const AlertConfig = (props) => {
    const [botConfig, setBotConfig] = useState({alertConfigs: {cheerAlert: {}, subAlert: {}, raidAlert: {}, followAlert:{}}});
    const [dynamicAlerts, setDynamicAlerts] = useState([]);
    
    useEffect(async () => {
        let botConfig = await ApiHelper.getBot(props.channel);
        let dynamicAlerts = await ApiHelper.getDynamicAlerts(props.channel);
        setBotConfig(botConfig);
        setDynamicAlerts(dynamicAlerts);
    }, []);

    return (
        <div>
            <h1>Alert Config</h1>
            <h3>Cheer Alert</h3>
            <AlertConfigElement 
                type="cheer"
                alertConfig={botConfig.alertConfigs.cheerAlert}
                botConfig={botConfig}
                dynamicAlerts={dynamicAlerts}
                onChange={
                    async (config) => {
                        let updatedAlertConfig = {...botConfig.alertConfigs, cheerAlert: config};
                        setBotConfig({...botConfig, alertConfigs: updatedAlertConfig});
                    }
                } />
            <h3>Subscription Alert</h3>
            <AlertConfigElement 
                type="subscription"
                alertConfig={botConfig.alertConfigs.subAlert}
                botConfig={botConfig}
                dynamicAlerts={dynamicAlerts}
                onChange={
                    async (config) => {
                        let updatedAlertConfig = {...botConfig.alertConfigs, subAlert: config};
                        setBotConfig({...botConfig, alertConfigs: updatedAlertConfig});
                    }
                } />
            <h3>Follow Alert</h3>
            <AlertConfigElement 
                type="follow"
                alertConfig={botConfig.alertConfigs.followAlert}
                botConfig={botConfig}
                dynamicAlerts={dynamicAlerts}
                onChange={
                    async (config) => {
                        let updatedAlertConfig = {...botConfig.alertConfigs, followAlert: config};
                        setBotConfig({...botConfig, alertConfigs: updatedAlertConfig});
                    }
                } />
            <h3>Raid Alert</h3>
            <AlertConfigElement 
                type="raid"
                alertConfig={botConfig.alertConfigs.raidAlert}
                botConfig={botConfig}
                dynamicAlerts={dynamicAlerts}
                onChange={
                    async (config) => {
                        let updatedAlertConfig = {...botConfig.alertConfigs, raidAlert: config};
                        setBotConfig({...botConfig, alertConfigs: updatedAlertConfig});
                    }
                } />
            <button onClick={async () => {
                await ApiHelper.updateAlertConfig(props.channel, botConfig.alertConfigs);
            }}>Save</button>
        </div>
    )
};

export default AlertConfig;