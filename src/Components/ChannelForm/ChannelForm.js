// ChannelForm.js
import React, { Component } from "react";
import '../ChannelForm/ChannelForm.css'


export default class ChannelForm extends Component {
// ChannelForm.js
constructor(props) {
  super(props);
  this.state = {
    channel: "",
    disabled:true
  };
}


onChange = e => {
  let { name, value } = e.target;
  this.setState({ [name]: value });
  if(value === "catorcetest"){
    this.setState({disabled:!this.state.disabled})
  }
};

onSubmit = e => {
  alert("si")
  e.preventDefault();
  console.log("Submiting ", this.state.channel);
  this.props.selectChannel(this.state.channel);
  this.setState({ channel: "" });
};

render(props) {

  return (
    <div>
      <form onSubmit={this.onSubmit}>
        <label>Channel Name</label>
        <input placeholder="Nombre del Canal" name="channel"
            value={this.state.channel}
            onChange={this.onChange} />
            <input type="submit" disabled={this.state.disabled} value="CatorceTest" />
      </form>
    </div>
  );
}
}