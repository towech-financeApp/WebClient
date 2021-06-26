/** Notfound.js
 * Copyright (c) 2021, Jose Tow
 * All rights reserved.
 *
 * 404 - Error component
 */
import React from 'react';
import { Link } from 'react-router-dom';

// TODO: 404 Error page

const NotFound = () => {
  return (
    <>
      <h1>404 - Not Found!</h1>
      <Link to="/">Go Home</Link>
    </>
  );
};

export default NotFound;
