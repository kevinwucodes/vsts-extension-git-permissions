import React from 'react'
import ReactDOM from 'react-dom'

import AppContainer from './AppContainer'

const loadApp = (VssAuthService, CoreRestClient, GitRestClient) => {
  //TODO do we put notification here?  All this does is takes off the loading spinner and undims the app
  VSS.notifyLoadSucceeded()

  ReactDOM.render(
    <AppContainer services={[VssAuthService, CoreRestClient, GitRestClient]} />,
    document.getElementById('root-git-permissions')
  )
}

export default loadApp
