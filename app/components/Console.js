import React, { Component } from 'react';
import { connect } from 'react-redux';

const dialogs = window.require('dialogs')();

const mapStateToProps = state => {
  const { console, logger } = state;

  return { console, logger };
};

const consoleStyle = {
  fontSize: '12px',
  backgroundColor: 'rgb(7, 15, 70)',
  color: 'rgb(236, 236, 236)',
  width: '70%',
  height: '300px',
  border: 'none',
  margin: '20px auto',
  display: 'block',
};

class Console extends Component {
  constructor(props) {
    super(props);

    this.props.parent.console = this;

    this.dialogAsPromise = this.dialogAsPromise.bind(this);
    this.multipleDialogs = this.multipleDialogs.bind(this);
  }

  dialogAsPromise(question) {
    return new Promise((resolve) => {
      dialogs.prompt(question, (res) => {
        resolve(res);
      });
    });
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

  render() {
    return (
      <div style={{ display: this.props.display }}>
        <textarea style={consoleStyle} disabled cols="80" rows="20" name="output" id="console" value={this.props.logger} />
      </div>
    );
  }
}

const ConnectedConsole = connect(mapStateToProps)(Console);

export default ConnectedConsole;

