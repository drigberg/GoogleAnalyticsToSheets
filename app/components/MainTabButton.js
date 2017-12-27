import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHOW_MAIN_TAB } from '../constants/actionTypes';
import { MAIN_TAB } from '../constants';

const mapDispatchToProps = dispatch => ({
  showMainTab: () =>
    dispatch({
      type: SHOW_MAIN_TAB
    })
});

const mapStateToProps = state => {
  const { tab } = state;

  return { tab };
};

class MainTabButton extends Component {
  constructor(props) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    if (this.props.tab !== MAIN_TAB) {
      this.props.showMainTab();
    }
  }

  render() {
    return (
      <button type="button" onClick={this.clickHandler} id="main-tab-button">Main</button>
    );
  }
}

const ConnectedMainTabButton = connect(mapStateToProps, mapDispatchToProps)(MainTabButton);

export default ConnectedMainTabButton;
