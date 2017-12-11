import React, { Component } from 'react';
import Checkbox from './Checkbox';
import { addCheckbox, removeCheckbox } from '../actions'
import { connect } from 'react-redux'

class Form extends Component {
  constructor(props) {
    super(props);

    this.props.parent.form = this;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.fetchAndSend = this.fetchAndSend.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;

    if (target.checked) {
      this.props.dispatch(addCheckbox(target.className, target.name))
      return
    }

    this.props.dispatch(removeCheckbox(target.className, target.name))
  }

  fetchAndSend() {
    this.props.parent.fetchAndSend()
  }

  get metrics() {
    return Array.from(document.getElementsByClassName("metric"))
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.id)
  }

  get dimensions() {
    return Array.from(document.getElementsByClassName("dimension"))
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.id)
  }

  render() {
    const sendEnabled = this.props.client && this.props.client.credentials

    return (
      <form style={{ display: this.props.display }} id="form">
        <div>
          <h3>Metrics</h3>

          <Checkbox className="metrics" name="sessions" clickHandler={this.handleInputChange} />
          <Checkbox className="metrics" name="pageLoadTime" clickHandler={this.handleInputChange} />
          <Checkbox className="metrics" name="timeOnPage" clickHandler={this.handleInputChange} />
        </div>

        <div>
          <h3>Dimensions</h3>

          <Checkbox className="dimensions" name="screenResolution" clickHandler={this.handleInputChange} />
          <Checkbox className="dimensions" name="city" clickHandler={this.handleInputChange} />
          <Checkbox className="dimensions" name="country" clickHandler={this.handleInputChange} />
          <Checkbox className="dimensions" name="browser" clickHandler={this.handleInputChange} />
          <Checkbox className="dimensions" name="operatingSystem" clickHandler={this.handleInputChange} />
          <Checkbox className="dimensions" name="userType" clickHandler={this.handleInputChange} />
        </div>

        <button disabled={sendEnabled} type="button" onClick={this.fetchAndSend}>Fetch and Send</button>
        <button disabled={!sendEnabled} type="button" onClick={this.props.parent.getNewToken}>Get New Auth Token</button>

        <textarea disabled cols="80" rows="20" id="console"></textarea>
        <input type="text" id="console-input"></input>
      </form>
    );
  }
}


const mapStateToProps = state => {
  const { form } = state

  return { form }
}

const ConnectedForm = connect(mapStateToProps)(Form)

export default ConnectedForm;
