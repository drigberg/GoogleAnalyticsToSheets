import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHOW_README_TAB } from '../../constants/actionTypes';
import { README_TAB } from '../../constants';

const mapDispatchToProps = dispatch => ({
  showReadmeTab: () =>
    dispatch({
      type: SHOW_README_TAB
    })
});

const mapStateToProps = state => {
  const { tab } = state;

  return { tab };
};

class ReadmeTabButton extends Component {
  constructor(props) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    if (this.props.tab !== README_TAB) {
      this.props.showReadmeTab();
    }
  }

  render() {
    return (
      <button type="button" onClick={this.clickHandler} id="main-tab-button">Readme</button>
    );
  }
}

const ConnectedReadmeTabButton = connect(mapStateToProps, mapDispatchToProps)(ReadmeTabButton);

export default ConnectedReadmeTabButton;
