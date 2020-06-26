// App.js
import React, { Component } from "react";
import ChannelForm from "./Components/ChannelForm/ChannelForm";
import Call from './Components/Call/Call'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: ''
    }
  }

  selectChannel = channel => {
    this.setState({ channel });
  };

  render() {
    return (
      <div className="App">
        <ChannelForm selectChannel={this.selectChannel} />
        <Call channel={this.state.channel}/>
      </div>
    );
  }
}

export default App;
