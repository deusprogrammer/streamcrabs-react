import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import ApiHelper from '../utils/ApiHelper';

const RaidAlertManager = (props) => {
    let [dynamicAlerts, setDynamicAlerts] = useState([]);

    let getConfigs = async () => {
        let configs = await ApiHelper.getDynamicAlerts(props.channel);
        setDynamicAlerts(configs);
    }

    useEffect(() => {
        getConfigs();
    }, []);

    return (
        <div>
            <h1>Dynamic Alerts Manager</h1>
            <table>
                <tbody>
                    {dynamicAlerts.map((dynamicAlert) => {
                        return (
                            <tr>
                                <td>{dynamicAlert.name}</td>
                                <td>
                                    <button onClick={() => {window.location = `https://deusprogrammer.com/util/twitch-tools/raid-test?raider=wagnus&raidSize=1000&theme=STORED&key=${dynamicAlert._id}`}}>Preview</button>
                                    <Link to={`${process.env.PUBLIC_URL}/configs/raid-alert/${dynamicAlert._id}`} target="_blank"><button type="button">Edit</button></Link>
                                    <button onClick={() => {alert("This doesn't function yet")}}>Delete</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default RaidAlertManager;