import React, {useState, useEffect} from 'react';
import MediaPoolSelector from '../elements/MediaPoolSelector';
import ApiHelper from '../utils/ApiHelper';

import {toast} from 'react-toastify';

export default (props) => {
    const [config, setConfig] = useState(null);
    const [newGauge, setNewGauge] = useState({});
    const [selected, setSelected] = useState(null);
    const [delta, setDelta] = useState(1);

    useEffect(() => {
        (async () => {
            let config = await ApiHelper.getBot(props.channel);
            let keys = Object.keys(config.gauges);
            setConfig(config);
            setSelected(keys.length > 0 ? keys[0]: null);
        })();
    }, []);

    const updateNewGauge = (field, value) => {
        let gauge = {...newGauge};
        gauge[field] = value;
        setNewGauge(gauge);
    }

    const addGauge = async () => {
        let gauges = {...config.gauges};

        newGauge.currentValue = 0;
        newGauge.maxValue = parseInt(newGauge.maxValue);
        gauges[newGauge.key] = newGauge;
        setConfig({...config, gauges});
        setNewGauge({key: "", label: "", maxValue: null, increaseSound: null, decreaseSound: null, completeSound: null});
        await ApiHelper.updateGauges(config.twitchChannelId, gauges);
    }

    const removeGauge = async (id) => {
        let newConfig = {...config}
        let gauges = {...newConfig.gauges};
        delete gauges[id];
        newConfig.gauges = gauges;
        setConfig(newConfig);
        await ApiHelper.updateGauges(config.twitchChannelId, gauges);
    }

    if (!config) {
        return (
            <div style={{position: "absolute", width: "100vw", top: "50%", left: "0px", transform: "translateY(-50%)", textAlign: "center"}}>
                Loading Config...
            </div>
        )
    }

    return (
        <div>
            <h1>Gauges</h1>
            <h2>Manage Gauges</h2>
            <p>With this section you can create gauges that can be triggered by channel point redemptions.  The overlay for this is still in development.</p>
            <div style={{marginLeft: "20px"}}>
                <table className="config-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Label</th>
                            <th>Maximum Value</th>
                            <th>Increase Sound</th>
                            <th>Decrease Sound</th>
                            <th>Complete Sound</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(config.gauges).map((key) => {
                            let gauge = config.gauges[key];

                            return (
                                <tr key={`gauge-${key}`}>
                                    <td>
                                        <input 
                                            type="text" 
                                            value={key}
                                            disabled={true}/>
                                    </td>
                                    <td>
                                        <input 
                                            type="text" 
                                            value={gauge.label}
                                            disabled={true}/>
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            value={gauge.maxValue}
                                            disabled={true}/>
                                    </td>
                                    <td>
                                        <MediaPoolSelector 
                                            type={"AUDIO"} 
                                            config={config} 
                                            keySuffix={key}
                                            value={gauge.increaseSound}
                                            disabled={true}/>
                                    </td>
                                    <td>
                                        <MediaPoolSelector 
                                            type={"AUDIO"} 
                                            config={config} 
                                            keySuffix={key}
                                            value={gauge.decreaseSound}
                                            disabled={true}/>
                                    </td>
                                    <td>
                                        <MediaPoolSelector 
                                            type={"AUDIO"} 
                                            config={config} 
                                            keySuffix={key}
                                            value={gauge.completeSound}
                                            disabled={true}/>
                                    </td>
                                    <td>
                                        <button onClick={() => {navigator.clipboard.writeText(`${process.env.PUBLIC_URL}/overlays/gauges?channelId=${props.channel}&label=${encodeURIComponent(gauge.label)}&subPanel=${key}`).then(() => {toast.info("Copied Overlay Url")})}}>Copy</button>
                                        <button onClick={() => {removeGauge(key)}}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                        <tr>
                            <td>
                                <input 
                                    type="text" 
                                    value={newGauge.key}
                                    onChange={({target: {value}}) => {
                                        updateNewGauge("key", value);
                                    }} />
                            </td>
                            <td>
                                <input  
                                    type="text" 
                                    value={newGauge.label}
                                    onChange={({target: {value}}) => {
                                        updateNewGauge("label", value);
                                    }} />
                            </td>
                            <td>
                                <input  
                                    type="number" 
                                    value={newGauge.maxValue}
                                    onChange={({target: {value}}) => {
                                        updateNewGauge("maxValue", value);
                                    }} />
                            </td>
                            <td>
                                <MediaPoolSelector 
                                    type={"AUDIO"} 
                                    config={config} 
                                    keySuffix={"new"}
                                    value={newGauge.increaseSound}
                                    onChange={({target: {value}}) => {
                                        updateNewGauge("increaseSound", value);
                                    }} />
                            </td>
                            <td>
                                <MediaPoolSelector 
                                    type={"AUDIO"} 
                                    config={config} 
                                    keySuffix={"new"}
                                    value={newGauge.decreaseSound}
                                    onChange={({target: {value}}) => {
                                        updateNewGauge("decreaseSound", value);
                                    }} />
                            </td>
                            <td>
                                <MediaPoolSelector 
                                    type={"AUDIO"} 
                                    config={config} 
                                    keySuffix={"new"}
                                    value={newGauge.completeSound}
                                    onChange={({target: {value}}) => {
                                        updateNewGauge("completeSound", value);
                                    }} />
                            </td>
                            <td><button onClick={() => {addGauge()}}>Add</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h2>Create Command Block</h2>
            <div style={{marginLeft: "20px"}}>
                <p>To have a channel point reward trigger a change in a gauge you have to add a command block to the reward description on Twitch.  Use the tool below to create a command block.</p>
                <table>
                    <thead style={{textAlign: "center"}}>
                        <th>Gauge</th>
                        <th>Amount</th>
                        <th>Command Block</th>
                        <th></th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select 
                                    value={selected}
                                    onChange={({target: {value}}) => {
                                        setSelected(value);
                                    }}>
                                        <option value={null}>Select Gauge</option>
                                        {Object.keys(config.gauges).map((key) => {
                                            let gauge = config.gauges[key];
                                            return (
                                                <option value={key}>{gauge.label}</option>
                                            )
                                        })}
                                </select>
                            </td>
                            <td>
                                <input type="number" value={delta} onChange={({target: {value}}) => {setDelta(value)}} />
                            </td>
                            <td style={{width: "300px", textAlign: "center"}}>
                                <preformatted>{`[GAUGE:${selected}:ADD:${delta}]`}</preformatted>
                            </td>
                            <td><button onClick={() => {navigator.clipboard.writeText(`[GAUGE:${selected}:ADD:${delta}]`).then(() => {toast.info("Copied Command Block")})}}>Copy</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}