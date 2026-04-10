import React from 'react'
import './Background.css'
import PropTypes from 'prop-types';

function Background({ children }) {
  return (
    // This wrapper gives every routed page the same background treatment.
    <div className="background">
      {children}
    </div>
  );
}

Background.propTypes = {
  children: PropTypes.node,
};

export default Background;
