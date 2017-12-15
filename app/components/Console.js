import React, { Component } from 'react';
import { connect } from 'react-redux';

const dialogs = window.require('dialogs')();
const styles = {
  console: {
    fontSize: '12px',
    backgroundColor: 'rgb(11, 25, 100)',
    color: 'rgb(236, 236, 236)',
    position: 'absolute',
    left: '0px',
    width: '100%',
    border: 'none',
    bottom: '0px',
  },
  input: {
    display: 'none',
    width: '100%',
    fontSize: '14px',
    height: '30px',
    position: 'absolute',
    bottom: '0px',
    left: '0px',
    zIndex: 2,
    border: 'none',
    backgroundColor: 'rgb(8, 18, 68)',
    color: 'white'
  }
};

class Console extends Component {
  constructor(props) {
    super(props);

    this.props.parent.console = this;
    this.state = {
      inputHandler: null,
      inputVisible: false,
      output: ''
    };
    this.dialogAsPromise = this.dialogAsPromise.bind(this);
    this._handleKeyPress = this._handleKeyPress.bind(this);
    this.multipleDialogs = this.multipleDialogs.bind(this);
  }

  dialogAsPromise(question) {
    return new Promise((resolve) => {
      dialogs.prompt(question, (res) => {
        resolve(res);
      });
    });
  }

  showInput(handler) {
    if (!this.state.inputHandler) {
      const newState = Object.assign(this.state, { inputVisible: true, inputHandler: handler });

      this.setState(newState);
    }
  }

  hideInput() {
    const newState = Object.assign(this.state, { inputVisible: false, inputHandler: null });

    this.setState(newState);
  }

  multipleDialogs(questions, responses) {
    if (!responses) {
      responses = [];
    }

    return this.dialogAsPromise(questions.shift())
      .then((res) => {
        responses.push(res);

        if (!questions.length) {
          return responses;
        }

        return this.multipleDialogs(questions, responses);
      });
  }

  _handleKeyPress(event) {
    if (event.key === 'Enter') {
      const handler = this.state.inputHandler;
      const payload = event.target.value;

      this.props.parent[handler](payload);
      this.hideInput();
    }
  }

  render() {
    styles.console.bottom = this.state.inputVisible ? 30 : 0;
    styles.input.display = this.state.inputVisible ? 'block' : 'none';

    return (
      <div style={{ display: this.props.display }}>
        <textarea style={styles.console} disabled cols="80" rows="20" name="output" id="console" value={this.props.logger} />
        <input style={styles.input} type="text" name="input" id="console-input" onKeyPress={this._handleKeyPress} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { logger } = state;

  return { logger };
};

const ConnectedConsole = connect(mapStateToProps)(Console);

export default ConnectedConsole;

