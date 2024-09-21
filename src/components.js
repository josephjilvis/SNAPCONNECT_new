import React, { Component } from 'react';

class Ak extends Component {
  render() {
    return (
      <div>
        {this.props.name}
      <p>{this.props.age}</p> 
       <p>{this.props.power}</p> 
       <p>{this.props.id}</p>
        
      </div>
    );
  }
}

export default Ak;
