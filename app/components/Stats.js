import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  const { clients, ids } = state;

  return { clients, ids };
};

class Console extends Component {
  render() {
    const paragraph = `${JSON.stringify(this.props.clients)} - ${JSON.stringify(this.props.ids)}`

    return (
      <div id="stats">
        <p>{paragraph}</p>
      </div>
    );
  }
}

const ConnectedConsole = connect(mapStateToProps)(Console);

export default ConnectedConsole;

