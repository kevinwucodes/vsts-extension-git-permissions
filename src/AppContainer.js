import 'babel-polyfill'
import React from 'react'
import { fetchData } from './fetchData'

import Viewer from './Components/Viewer'
import ErrorMessage from './Components/ErrorMessage'

class AppContainer extends React.Component {
  constructor(props) {
    super(props)

    this.handleInputChange = this.handleInputChange.bind(this)
  }

  state = {
    gitPermissions: [],
    errors: '',
    entityNameSearch: ''
  }

  handleInputChange(e) {
    this.setState({
      entityNameSearch: e.target.value
    })
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
      .finally(() => {
        //TODO do we put notification here?  All this does is takes off the loading spinner and undims the app
        VSS.notifyLoadSucceeded()
      })
  }

  render() {
    const { gitPermissions, errors, entityNameSearch } = this.state
    return (
      <div>
        <h1>Git permission viewer</h1>
        <input
          type="text"
          placeholder="entityNameSearch"
          value={entityNameSearch}
          onChange={this.handleInputChange}
          size="60"
        />
        <Viewer gitPermissions={gitPermissions} entityFilter={entityNameSearch} />
        <ErrorMessage message={errors} />
      </div>
    )
  }
}

export default AppContainer
