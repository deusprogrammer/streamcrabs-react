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
            <table className="dynamic-alerts-table">
                <tbody>
                    {dynamicAlerts.map((dynamicAlert) => {
                        return (
                            <tr>
                                <td>{dynamicAlert.name}</td>
                                <td>
                                    <a target="_blank" href={`https://deusprogrammer.com/util/twitch-tools/raid-test?raider=wagnus&raidSize=1000&theme=STORED&key=${dynamicAlert._id}`}><button className="primary">Preview</button></a>
                                    <Link to={`${process.env.PUBLIC_URL}/configs/dynamic-alert/${dynamicAlert._id}`}><button className="primary" type="button">Edit</button></Link>
                                    <button className="destructive" onClick={() => {alert("This doesn't function yet")}}>Delete</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Link to={`${process.env.PUBLIC_URL}/configs/dynamic-alert`}><button>Create New Dynamic Alert</button></Link>
        </div>
    )
}

export default RaidAlertManager;