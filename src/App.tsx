import React from "react";
import { Component } from "react";

import "./App.css";

interface Props {}
interface State {}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // async function always returns a Promise
  async dramaticWelcome(): Promise<void> {
    await fetch("http://localhost/kaltura/?user=meme")
      .then(response => response.text())
      .then(data => console.log(data));
  }

  handleSubmit() {
    this.dramaticWelcome();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.handleSubmit}> CALL ME </button>
        </header>
      </div>
    );
  }
}

export default App;
