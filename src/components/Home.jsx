import React from 'react';

export default class Home extends React.Component {
    componentDidMount = () => {
        document.title = "Welcome to Streamcrabs";
    }

    render() {
        return (
            <div></div>
        );
    }
}