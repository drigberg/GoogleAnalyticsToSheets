import React, { Component } from 'react';

class ToggleReadme extends Component {
  constructor(props) {
    super(props)
    this.state = { active: false }
    this.props.parent.toggleReadme = this
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    const active = this.props.parent.state.readmeActive
    const newState = Object.assign({}, this.props.parent.state, { readmeActive: !active })
    this.props.parent.setState(newState)
  }

  render() {
    return (
      <button type="button" onClick={this.toggle} id="toggle-readme">Toggle Readme</button>
    )
  }
}

export default ToggleReadme