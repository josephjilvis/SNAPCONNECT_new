import React, { Component } from "react";

class Gk extends Component {
  render() {
    return (
      <div style={{ backgroundColor: 'black' }}>
        <div style={{
          backgroundColor: 'lightgreen',
          margin: '2rem',
        }}>
          <p style={{
            paddingLeft: '2rem',
            paddingTop: '2rem',
          }}>
            {this.props.id1}
          </p>
          <p style={{ paddingLeft: '2rem' }}>
          {this.props.id2}
          </p>
          <p style={{ paddingLeft: '2rem' }}>
          {this.props.id3}
          </p>
          <button style={{ backgroundColor: 'rgb(6, 156, 6)',marginLeft: '2rem', marginBottom: '2rem',borderRadius: '2px',color: 'white', fontSize: 'small',
            fontWeight: '100',textAlign: 'center',paddingLeft: '1rem',paddingTop: '0.5rem',paddingBottom: '0.5rem',paddingRight: '0.5rem',
          }}>
          {this.props.bn}
          </button>
        </div>
      </div>
    );
  }
}

export default Gk;
