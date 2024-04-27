import React, { useState } from 'react';
import axios from 'axios';
import config from '../config/config';

const Migration = () => {
    const [migrationCode, setMigrationCode] = useState();

    const generateMigrationCode = async () => {
        let found = await axios.post(`${config.BASE_URL}/one-time-keys`, {}, {
            headers: {
                "X-Access-Token": localStorage.getItem("accessToken")
            }
        });
    
        setMigrationCode(found.data.oneTimeKey);
    }

    return (
        <div>
            <h2>Migration Code</h2>
            <p>Streamcrab servers will be shutting down by the end of the year.  A desktop version will be available soon that will allow you to continue using the features of the service, and will continue to receive updates and take feature requests.</p>
            <p>The reason for this migration is because enough people use the service now that it's beginning to take a toll on my bandwidth, and you folks are starting to see issues popping up due to the hit my meager upstream bandwidth is taking.  The desktop version keeps all assets like videos and music files local and removes the need to rely on an external server.</p>
            <p>With that said, I want to say I appreciate each and every one of you who have decided to use my tool.  I never thought I would make anything that people actually wanted to use, and I am honored that you chose Streamcrabs.  I hope we have many more adventures in the near future.</p>
            <input type="text" value={migrationCode} disabled />
            <button onClick={() => {generateMigrationCode()}}>Generate Migration Code</button>
        </div>
    );
}

export default Migration;