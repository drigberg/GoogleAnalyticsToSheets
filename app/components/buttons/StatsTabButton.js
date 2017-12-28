import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHOW_STATS_TAB } from '../../constants/actionTypes';
import { STATS_TAB } from '../../constants';

const mapDispatchToProps = dispatch => ({
  showStatsTab: () =>
    dispatch({
      type: SHOW_STATS_TAB
    })
});

const mapStateToProps = state => {
  const { tab } = state;

  return { tab };
};

class StatsTabButton extends Component {
  constructor(props) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    if (this.props.tab !== STATS_TAB) {
      this.props.showStatsTab();
    }
  }

  render() {
    return (
      <button type="button" onClick={this.clickHandler} id="main-tab-button">Stats</button>
    );
  }
}

const ConnectedStatsTabButton = connect(mapStateToProps, mapDispatchToProps)(StatsTabButton);

export default ConnectedStatsTabButton;
