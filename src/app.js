import React from 'react'
import ReactDOM from 'react-dom'

import AppContainer from './AppContainer'

const loadApp = (VssAuthService, CoreRestClient, GitRestClient) => {
  ReactDOM.render(
    <AppContainer services={[VssAuthService, CoreRestClient, GitRestClient]} />,
    document.getElementById('root-git-permissions')
  )
}

export default loadApp
