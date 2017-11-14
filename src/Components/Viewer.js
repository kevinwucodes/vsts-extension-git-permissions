import React from 'react'

const Viewer = ({ gitPermissions, entityFilter, masterBranchFilter }) => {
  const renderRepos = entityFilter => {
    const perms = gitPermissions
      .map(part => {
        const filteredPermissions = part.permissions.filter(
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
      .filter(part => {
        if (masterBranchFilter) {
          if (!/\/refs\//.test(part.repoPath)) {
            return true
          } else if (
            /\/refs\//.test(part.repoPath) &&
            /\/refs\/heads\/master/.test(part.repoPath)
          ) {
            return true
          }
        } else {
          return true
        }
      })
      .sort((a, b) => {
        if (a.repoPath.toUpperCase() < b.repoPath.toUpperCase()) {
          return -1
        }
        if (a.repoPath.toUpperCase() > b.repoPath.toUpperCase()) {
          return 1
        }
        return 0
      })
      .map(part => {
        const { repoPath, filteredPermissions } = part

        const entityPerms = filteredPermissions.map(
          (part, permissionsIndex) => {
            const { entityName, allow } = part

            const entityAllowPerms = allow.map(part => part.name).join(', ')
            return (
              <p key={permissionsIndex}>
                <span className="entityName">{entityName}</span>:{' '}
                <span className="italics">{entityAllowPerms}</span>
              </p>
            )
          }
        )

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
