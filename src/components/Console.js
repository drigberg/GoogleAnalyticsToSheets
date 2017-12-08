import React, { Component } from 'react';

const dialogs = window.require('dialogs')()

class Console extends Component {
  constructor(props) {
    super(props);

    this.props.parent.console = this;
    this.state = {
      output: ""
    }
    this.dialogAsPromise = this.dialogAsPromise.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this.multipleDialogs = this.multipleDialogs.bind(this);
  }

  dialogAsPromise(question) {
    return new Promise((resolve, reject) => {
      dialogs.prompt(question, (res) => {
        resolve(res)
      })
    })
  }

  multipleDialogs(questions, responses) {
    if (!responses) {
      responses = []
    }

    return this.dialogAsPromise(questions.shift())
      .then((res) => {
        responses.push(res)

        if (!questions.length) {
          return responses
        }

        return this.multipleDialogs(questions, responses)
      })
  }

  _handleKeyPress(event) {
    const newState = Object.assign({}, this.state, { input: event.target.value })

    this.setState(newState)
    if (event.key === 'Enter') {
      console.log(this.state)
      console.log("ENTER!!!!")
    }
  }

  render() {
    return (
      <div>
        <textarea disabled cols="80" rows="20" name="output" id="console" value={this.state.output}></textarea>
        <input type="text" name="input" id="console-input3" onKeyPress={this._handleKeyPress}></input>
      </div>
    );
  }
}

export default Console;




