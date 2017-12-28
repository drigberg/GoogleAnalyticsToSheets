import React, { Component } from 'react';
import { connect } from 'react-redux';
import { REMOVE_INPUT_HANDLER, SET_INPUT_HANDLER } from '../constants/actionTypes';

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

const mapDispatchToProps = dispatch => ({
  setInputHandler: (handler) =>
    dispatch({
      type: SET_INPUT_HANDLER,
      handler
    }),
  removeInputHandler: () =>
    dispatch({
      type: REMOVE_INPUT_HANDLER
    })
});

const mapStateToProps = state => {
  const { console, logger } = state;

  return { console, logger };
};

class Console extends Component {
  constructor(props) {
    super(props);

    this.props.parent.console = this;

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
    if (!this.props.console.inputHandler) {
      this.props.setInputHandler(handler);
    }
  }

  hideInput() {
    this.props.removeInputHandler();
  }

  async multipleDialogs(questions, responses) {
    if (!responses) {
      responses = [];
    }

    const res = await this.dialogAsPromise(questions.shift());

    responses.push(res);

    if (!questions.length) {
      return responses;
    }

    return this.multipleDialogs(questions, responses);
  }

  _handleKeyPress(event) {
    if (event.key === 'Enter') {
      const handler = this.props.console.inputHandler;
      const payload = event.target.value;

      this.props.parent[handler](payload);
      this.hideInput();
    }
  }

  render() {
    styles.console.bottom = this.props.console.inputHandler ? 30 : 0;
    styles.input.display = this.props.console.inputHandler ? 'block' : 'none';

    const consoleStyle = Object.assign({}, styles.console);
    const inputStyle = Object.assign({}, styles.input);

    return (
      <div style={{ display: this.props.display }}>
        <textarea style={consoleStyle} disabled cols="80" rows="20" name="output" id="console" value={this.props.logger} />
        <input style={inputStyle} type="text" name="input" id="console-input" onKeyPress={this._handleKeyPress} />
      </div>
    );
  }
}

const ConnectedConsole = connect(mapStateToProps, mapDispatchToProps)(Console);

export default ConnectedConsole;

