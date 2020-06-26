import React, { Component } from "react";

import AgoraRTC from "agora-rtc-sdk";

import '../Call/Call.css'

let client = AgoraRTC.createClient({ mode: "live", codec: "h264" });

const APP_ID = "fe96d319a7bf449cab5d83778c71b7e8";
const USER_ID = Math.floor(Math.random() * 1000000001);

export default class Call extends Component {
  localStream = AgoraRTC.createStream({
    streamID: USER_ID,
    audio: true,
    video: true,
    screen: false
  });

  state = {
    remoteStreams: {}
  };

  componentDidMount() {
    this.initLocalStream();
    this.initClient();
  }
  componentDidUpdate(prevProps, prevState) {
    console.log("MIRARARARA")
    if (prevProps.channel !== this.props.channel && this.props.channel !== "") {
      this.joinChannel();
    }
  }
  joinChannel = () => {
    let me = this;
    client.join(
      null,
      me.props.channel,
      USER_ID,
      function(uid) {
        console.log("User " + uid + " join channel successfully");
        client.publish(me.localStream, function(err) {
          console.log("Publish local stream error: " + err);
        });

        client.on("stream-published", function(evt) {
          console.log("Publish local stream successfully");
        });
      },
      function(err) {
        console.log("Join channel failed", err);
      }
    );
  };
  initLocalStream = () => {
    let me = this;
    me.localStream.init(
      function() {
        console.log("getUserMedia successfully");
        me.localStream.play("agora_local");
      },
      function(err) {
        console.log("getUserMedia failed", err);
      }
    );
  };
  subscribeToClient = () => {
    let me = this;
    console.log(this.onStreamAdded)
    client.on("stream-added", me.onStreamAdded);
    client.on("stream-subscribed", me.onRemoteClientAdded);
    client.on("stream-removed", me.onStreamRemoved);
    client.on("peer-leave", me.onPeerLeave);
  };
  onStreamAdded = evt => {
    let me = this;
    let stream = evt.stream;
    console.log("New stream added: " + stream.getId());
    me.setState(
      {
        remoteStreams: {
          ...me.state.remoteStream,
          [stream.getId()]: stream
        }
      },
      () => {
        // Subscribe after new remoteStreams state set to make sure
        // new stream dom el has been rendered for agora.io sdk to pick up
        client.subscribe(stream, function(err) {
          console.log("Subscribe stream failed", err);
        });
      }
    );
  };
  onStreamRemoved = evt => {
    let me = this;
    let stream = evt.stream;
    if (stream) {
      let streamId = stream.getId();
      let { remoteStreams } = me.state;

      stream.stop();
      delete remoteStreams[streamId];

      me.setState({ remoteStreams });

      console.log("Remote stream is removed " + stream.getId());
    }
  };
  onRemoteClientAdded = evt => {
    console.log("HOLA")
    let me = this;
    let remoteStream = evt.stream;
    me.state.remoteStreams[remoteStream.getId()].play(
      "agora_remote " + remoteStream.getId()
    );
  };
  onPeerLeave = evt => {
    let me = this;
    let stream = evt.stream;
    if (stream) {
      let streamId = stream.getId();
      let { remoteStreams } = me.state;

      stream.stop();
      delete remoteStreams[streamId];

      me.setState({ remoteStreams });

      console.log("Remote stream is removed " + stream.getId());
    }
  };
  initClient = () => {
    client.init(
      APP_ID,
      function() {
        console.log("AgoraRTC client initialized");
      },
      function(err) {
        console.log("AgoraRTC client init failed", err);
      }
    );
    this.subscribeToClient();
  };
  render() {
    return (
      <div>
        <div id="agora_local" style={{ width: "400px", height: "400px" }} />
        {Object.keys(this.state.remoteStreams).map(key => {
          let stream = this.state.remoteStreams[key];
          let streamId = stream.getId();
          return (
            <div
              key={streamId}
              id={`agora_remote ${streamId}`}
              style={{ width: "400px", height: "400px" }}
            />
          );
        })}
      </div>
    );
  }
}