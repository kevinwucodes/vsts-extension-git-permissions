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
        const { repoObject, repoPath, filteredPermissions } = part

        const entityPerms = filteredPermissions.map((part, index) => {
          const { entityName, identity, allow } = part

          const entityAllowPerms = allow.map(part => part.name).join(', ')
          return (
            <div key={index}>
              {identity.imageUrl ? (
                <img
                  src={identity.imageUrl}
                  alt={identity.displayName}
                  title={identity.displayName}
                />
              ) : (
                <span>
                  <span className="entityName span-top">{entityName}</span>
                  :{' '}
                </span>
              )}

              <span className="italics span-top">{entityAllowPerms}</span>
            </div>
          )
        })

        return [
          <div className="item" key={repoPath}>
            <a href={repoObject.remoteUrl}>{repoPath}</a>
          </div>,
          <div className="item" key={entityPerms}>
            {entityPerms}
          </div>
        ]
      })

    return perms
  }

  //define the height of the root container here because of overflow:auto requirements
  //the main VSTS has overflow:hidden, which needs to be overridden with overflow:auto
  //but overflow:auto requires a height established in order for it to work
  // document.getElementById('permissions-container').style.height = `${document
  //   .documentElement.clientHeight}px`

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
