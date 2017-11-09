import React from 'react'

const ErrorMessage = ({ message }) => {
  return message ? (
    <div>
      <h1>
        There was an error loading the page so try refreshing to see if it'll
        help
      </h1>
      <h2>
        {message.name}: {message.message}
      </h2>
      <div>
        Note that this extension calls lots of APIs under the hood so network
        congestion could sometimes cause this extension to fail prematurely.
      </div>
    </div>
  ) : null
}

export default ErrorMessage
