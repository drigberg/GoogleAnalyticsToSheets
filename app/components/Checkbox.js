import React, { Component } from 'react';

class Checkbox extends Component {
  render() {
    return (
      <label htmlFor={this.props.name}>
        {this.props.name}
        <input
          type="checkbox"
          name={this.props.name}
          className={this.props.className}
          id={this.props.name}
          onChange={this.props.clickHandler}
        />

      </label>
    );
  }
}

export default Checkbox;
