import React from 'react'

const Dimension = ({ name }) => (
  <div>
    <input className="dimensions" id={name} type="checkbox"></input>
    <label htmlFor={name}>{name}</label>
  </div>
)

export default Dimension