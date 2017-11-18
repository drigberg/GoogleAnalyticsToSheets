import React from 'react'

const Metric = ({ name }) => (
  <div>
    <input className="metrics" id={name} type="checkbox"></input>
    <label htmlFor={name}>{name}</label>
  </div>
)

export default Metric