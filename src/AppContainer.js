import React from 'react'
import { fetchData } from './fetchData'

import Viewer from './Components/Viewer'
import ErrorMessage from './Components/ErrorMessage'


class AppContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    gitPermissions: [],
    errors: ''
  }

  componentDidMount() {
    const [VssAuthService, CoreRestClient, GitRestClient] = this.props.services

    fetchData(VssAuthService, CoreRestClient, GitRestClient)
      .then(response => {
        console.log('perms with metadata', response)
        this.setState((prevState, props) => {
          return {
            gitPermissions: response
          }
        })
      })
      .catch(err => {
        this.setState((prevState, props) => {
          return {
            errors: err
          }
        })
        console.error(err)
      })
  }

  render() {
    const { gitPermissions, token, errors } = this.state
    return (
      <div>
        <h1>Git permission viewer</h1>
        <Viewer gitPermissions={gitPermissions} />
        <ErrorMessage message={errors} />
      </div>
    )
  }
}

export default AppContainer
