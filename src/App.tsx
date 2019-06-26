import React from "react";
import { Component } from "react";
import Webcam from "react-webcam";
import { SpiralSpinner } from "react-spinners-kit";

import "./App.css";

interface Props {}
interface State {
  snap?: boolean;
  loading?: boolean;
  ks?: string;
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleSnap = this.handleSnap.bind(this);
    this.state = { snap: false, loading: true };
    this.getKs();
  }

  // async function always returns a Promise
  async getKs(): Promise<void> {
    await fetch("http://localhost/kaltura/?user=meme")
      .then(response => response.text())
      .then(data => this.setState({ ks: data, loading: false }));
  }

  handleSnap() {
    this.setState({ snap: true });
  }

  render() {
    const { snap, ks, loading } = this.state;
    return (
      <div className="App">
        <div className="spinner-wrapper">
          <SpiralSpinner loading={loading} size={200} />
        </div>
        <header className="App-header">
          {ks && <button onClick={this.handleSnap}>Snap me</button>}
          {snap && <Webcam />}
        </header>
      </div>
    );
  }
}

export default App;
