import 'babel-polyfill'
import React from 'react'
import { fetchData } from './fetchData'

import Viewer from './Components/Viewer'
import ErrorMessage from './Components/ErrorMessage'

class AppContainer extends React.Component {
  constructor(props) {
    super(props)

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleMasterBranchFilter = this.handleMasterBranchFilter.bind(this)
  }

  state = {
    gitPermissions: [],
    errors: '',
    entityNameSearch: '',
    masterBranchFilter: true
  }

  handleInputChange(e) {
    this.setState({
      entityNameSearch: e.target.value
    })
  }

  handleMasterBranchFilter(e) {
    this.setState({
      masterBranchFilter: e.target.checked
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
    const {
      gitPermissions,
      errors,
      entityNameSearch,
      masterBranchFilter
    } = this.state
    return (
      <div>
        <h1>Git permission viewer</h1>
        <input
          type="text"
          placeholder="entity name filter"
          value={entityNameSearch}
          onChange={this.handleInputChange}
          size="60"
        />
        <span>
          <input
            type="checkbox"
            checked={masterBranchFilter}
            onChange={this.handleMasterBranchFilter}
          />Filter on master branches only
        </span>
        <Viewer
          gitPermissions={gitPermissions}
          entityFilter={entityNameSearch}
          masterBranchFilter={masterBranchFilter}
        />
        <ErrorMessage message={errors} />
      </div>
    )
  }
}

export default AppContainer
