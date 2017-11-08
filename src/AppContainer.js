import React from 'react'
import { fetchData } from './fetchData'
import Viewer from './Components/Viewer'

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
      //master catch all errors here
      .catch(err => {
        this.setState((prevState, props) => {
          return {
            errors: err
          }
        })
        console.error('something bad happened:', err)
      })
  }

  render() {
    const { gitPermissions, token } = this.state
    return (
      <div>
        <h4>Git permission viewer</h4>
        <Viewer gitPermissions={gitPermissions} />
      </div>
    )
  }
}

export default AppContainer
