import React from 'react'
import ReactDOM from 'react-dom'

import AppContainer from './AppContainer'

const loadApp = (VssAuthService, CoreRestClient, GitRestClient) => {
  //TODO do we put notification here?  All this does is takes off the loading spinner and undims the app
  VSS.notifyLoadSucceeded()

  //define the height of the root container here because of overflow:auto requirements
  //the main VSTS has overflow:hidden, which needs to be overridden with overflow:auto
  //but overflow:auto requires a height established in order for it to work
  document.getElementById('root-git-permissions').style.height = `${document.documentElement.clientHeight}px`

  ReactDOM.render(
    <AppContainer services={[VssAuthService, CoreRestClient, GitRestClient]} />,
    document.getElementById('root-git-permissions')
  )
}

export default loadApp
