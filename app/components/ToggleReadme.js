import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hideReadme, showReadme } from '../actions';

class ToggleReadme extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    if (!this.props.readme.active) {
      this.props.dispatch(showReadme());
      return;
    }

    this.props.dispatch(hideReadme());
  }

  render() {
    return (
      <button type="button" onClick={this.toggle} id="toggle-readme">Toggle Readme</button>
    );
  }
}

const mapStateToProps = state => {
  const { readme } = state;

  return { readme };
};

const ConnectedToggleReadme = connect(mapStateToProps)(ToggleReadme);

export default ConnectedToggleReadme;
