import React, { Component } from 'react';

const dialogs = window.require('dialogs')()

class Console extends Component {
  constructor(props) {
    super(props);

    this.props.parent.console = this;
    this.state = {
      inputHandler: null,
      inputVisible: false,
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

  showInput(handler) {
    if (!this.state.inputHandler) {
      const newState = Object.assign(this.state, { inputVisible: true, inputHandler: handler })

      this.setState(newState)
    }
  }

  hideInput() {
    const newState = Object.assign(this.state, { inputVisible: false, inputHandler: null })

    this.setState(newState)
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
    if (event.key === 'Enter') {
      const handler = this.state.inputHandler
      const payload = event.target.value

      this.props.parent[handler](payload)
      this.hideInput()
    }
  }

  render() {
    const consoleBottom = this.state.inputVisible ? 30 : 0
    const inputDisplay = this.state.inputVisible ? "block" : "none"

    return (
      <div style={{ display: this.props.display }}>
        <textarea style={{ bottom: consoleBottom }} disabled cols="80" rows="20" name="output" id="console" value={this.state.output}></textarea>
        <input style={{ display: inputDisplay }} type="text" name="input" id="console-input" onKeyPress={this._handleKeyPress}></input>
      </div>
    );
  }
}

export default Console;




