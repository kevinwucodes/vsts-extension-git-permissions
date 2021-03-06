import {
  getGitSecurityNamespaces,
  getRepoPermissions,
  getIdentityFromDescriptor
} from './utils/api'
import { securityTokenRegex, refRegex } from './utils/regex'
import { refSecurableToString, demasker, finding } from './utils/helpers'

const repoTokenizer = token => securityTokenRegex.exec(token)
const refTokenizer = ref => refRegex.exec(ref)

const on = id => perm => {
  const [fullToken, repoV2, projectId, repoId, ref] =
    repoTokenizer(perm.token) || []

  if (projectId && projectId === id) {
    return true
  }
}

const descriptorToEntity = accountVsspsUri => bearerToken => async descriptor => {
  const normalizedDescriptor = descriptor.replace(/\\\\/g, '\\')

  const identity = await getIdentityFromDescriptor(accountVsspsUri)(
    bearerToken
  )(normalizedDescriptor)
  const { id, customDisplayName, providerDisplayName } = identity[0]
  return {
    id,
    descriptor,
    entityName: customDisplayName || providerDisplayName
  }
}

const fetchData = async (VssAuthService, CoreRestClient, GitRestClient) => {
  // console.log('before notify')
  //TODO: do we do this here or at the bottom?
  // VSS.notifyLoadSucceeded()
  // console.log('after notify')

  const { account, collection, host, project, team, user } = VSS.getWebContext()

  const { id: projectId, name: projectName } = project
  const { id: teamId, name: teamName } = team
  const { id: accountId, name: accountName, uri: accountUri } = account

  /*
  note: we add 'vssps' before 'visualstudio' because this API call is on
    {account}.vssps.visualstudio.com
  rather than
    {account}.visualstudio.com
  */
  const accountVsspsUri = accountUri.replace(
    /visualstudio/,
    'vssps.visualstudio'
  )

  //TODO: test failing awaits on axios on purposes to still render an error component

  const tokenObject = await VSS.getAccessToken()
  const bearerToken = VssAuthService.authTokenManager.getAuthorizationHeader(
    tokenObject
  )

  //TODO: map identities using teamMembers, by going to the object URL and retrieving the full identity payload
  const [
    gitSecurityNamespaces,
    projects,
    repos,
    teamMembers //teamMembers are for current project and team only defined by VSS.getWebContext()
  ] = await Promise.all([
    getGitSecurityNamespaces(accountUri, bearerToken),
    CoreRestClient.getClient().getProjects(),
    GitRestClient.getClient().getRepositories(),
    CoreRestClient.getClient().getTeamMembers(projectId, teamId)
  ])

  // console.log('projects', projects)
  // console.log('repos', repos)
  // console.log('gitSecurityNamespaces', gitSecurityNamespaces)
  // console.log('teamMembers', teamMembers)

  const repoPermissions = await getRepoPermissions(accountUri)(bearerToken)(
    gitSecurityNamespaces[0].namespaceId
  )
  // console.log('repoPermissions', repoPermissions)

  //get all the identity descriptors from each repoPermissions' acesDictionary
  const acesDictionary = repoPermissions
    .map(perm => Object.keys(perm.acesDictionary))
    .reduce((a, b) => a.concat(b), [])

  const distinctAcesDictionary = [...new Set(acesDictionary)]

  //build our identity descriptor cache
  await Promise.all(
    distinctAcesDictionary.map(descriptor =>
      descriptorToEntity(accountVsspsUri)(bearerToken)(descriptor)
    )
  )

  const repoTokenToPath = token => {
    const [fullToken, repoV2, projectId, repoId, ref] =
      repoTokenizer(token) || []

    const pathDescription = () => {
      if (!projectId) {
        return 'All repos in the entire account/collection'
      } else if (!repoId) {
        return 'All repos in the project'
      } else if (!ref) {
        return 'All refs in the repo'
      }
    }

    const { name: projectName = 'unknownProject' } =
      finding(projectId)(projects) || {}

    const repoObject = finding(repoId)(repos) || {}
    const { name: repoName = 'unknownRepo' } = repoObject

    const [fullRef, refName, refType, securable] = refTokenizer(ref) || []

    const repoPath = [
      repoName,
      refName,
      refType,
      refSecurableToString(securable)
    ]
      .filter(
        (part, index) => (!(index == 0 && part == undefined) ? part : null)
      )
      .join('/')

    return {
      repoObject,
      repoPath,
      pathDescription: pathDescription()
    }
  }

  const includeMetadata = async perm => {
    //derive the repoPath from the repoToken
    const { repoObject, repoPath, pathDescription } = repoTokenToPath(
      perm.token
    )
    perm.repoObject = repoObject
    perm.repoPath = repoPath
    perm.pathDescription = pathDescription

    // derive the permissions from acesDictionary
    perm.permissions = await Promise.all(
      Object.keys(perm.acesDictionary || {}).map(async key => {
        const {
          descriptor,
          allow: allowBitmask,
          deny: denyBitmask
        } = perm.acesDictionary[key]

        const entity = await descriptorToEntity(accountVsspsUri)(bearerToken)(
          descriptor
        )

        const identity = finding(entity.id)(teamMembers)

        const allow = demasker(allowBitmask)(gitSecurityNamespaces[0].actions)
        const deny = demasker(denyBitmask)(gitSecurityNamespaces[0].actions)

        return {
          ...entity,
          identity: {
            ...identity
          },
          allow,
          deny
        }
      })
    )

    return perm
  }

  const promises = repoPermissions.filter(on(projectId)).map(includeMetadata)

  return await Promise.all(promises)
}

export { fetchData }
