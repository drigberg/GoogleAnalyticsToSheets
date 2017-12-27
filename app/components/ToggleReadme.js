import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HIDE_README, SHOW_README } from '../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
  hideReadme: () =>
    dispatch({
      type: HIDE_README
    }),
  showReadme: () =>
    dispatch({
      type: SHOW_README
    })
});

const mapStateToProps = state => {
  const { readme } = state;

  return { readme };
};

class ToggleReadme extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    if (!this.props.readme.active) {
      this.props.showReadme();
      return;
    }

    this.props.hideReadme();
  }

  render() {
    return (
      <button type="button" onClick={this.toggle} id="toggle-readme">Toggle Readme</button>
    );
  }
}

const ConnectedToggleReadme = connect(mapStateToProps, mapDispatchToProps)(ToggleReadme);

export default ConnectedToggleReadme;
