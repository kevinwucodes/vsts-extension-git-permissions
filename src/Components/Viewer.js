import React from 'react'

const Viewer = ({ gitPermissions }) => {
  const renderRepos = () => {
    const perms = gitPermissions.map(part => {
      const { repoPath, permissions } = part

      const entityPerms = permissions.map((part, permissionsIndex) => {
        const { entityName, allow } = part

        const entityAllowPerms = allow.map(part => part.name).join(', ')
        return (
          <p key={permissionsIndex}>
            <span className="entityName">{entityName}</span>:{' '}
            <span className="italics">{entityAllowPerms}</span>
          </p>
        )
      })

      return [
        <div className="item" key={repoPath}>
          {repoPath}
        </div>,
        <div className="item" key={entityPerms}>
          {entityPerms}
        </div>
      ]
    })

    return perms
  }

  return (
    <div>
      <div className="container">{renderRepos()}</div>
    </div>
  )
}

export default Viewer
