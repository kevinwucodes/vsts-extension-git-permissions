import React from 'react'

const Viewer = ({ gitPermissions, entityFilter }) => {
  const renderRepos = entityFilter => {
    const filteredPerms = gitPermissions
      .map(part => {
        const { permissions } = part

        const filteredPermissions = permissions.filter(
          perm =>
            entityFilter
              ? perm.entityName && perm.entityName.includes(entityFilter)
              : true
        )

        return {
          ...part,
          filteredPermissions
        }
      })
      .filter(part => part.filteredPermissions.length > 0)

    const perms = filteredPerms.map(part => {
      const { repoPath, filteredPermissions } = part

      const entityPerms = filteredPermissions.map((part, permissionsIndex) => {
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
      {gitPermissions.length > 0 ? (
        <div className="container">{renderRepos(entityFilter)}</div>
      ) : (
        <div>Loading data or no Git Repos found...</div>
      )}
    </div>
  )
}

export default Viewer
