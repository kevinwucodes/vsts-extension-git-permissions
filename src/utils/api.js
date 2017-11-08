import axios from 'axios'
import { restEndpoints } from '../../config'

const bearerTokenHeader = bearerToken => ({
  headers: {
    Authorization: bearerToken
  }
})

const getSecurityNamespaces = accountInstanceUri => bearerToken => guid => {
  const namespace = restEndpoints.securityNamespace(guid)
  const url = `${accountInstanceUri}${namespace}`

  return axios(url, bearerTokenHeader(bearerToken))
}

const getGitSecurityNamespaces = async (accountUri, bearerToken) => {
  const { data: { value: securityNamespaces } } = await getSecurityNamespaces(
    accountUri
  )(bearerToken)('00000000-0000-0000-0000-000000000000')

  // console.log('securityNamespaces', securityNamespaces)

  const gitRepositoryNS = securityNamespaces.find(
    namespace => namespace.name == 'Git Repositories'
  )

  if (!gitRepositoryNS || Object.keys(gitRepositoryNS).length === 0) {
    throw Error('no git repositories found')
  }

  // console.log('gitRepositoryNS', gitRepositoryNS)

  const {
    data: { value: gitSecurityNamespaces }
  } = await getSecurityNamespaces(accountUri)(bearerToken)(
    gitRepositoryNS.namespaceId
  )

  return gitSecurityNamespaces
}

const getRepoPermissions = accountInstanceUri => bearerToken => async guid => {
  const namespace = restEndpoints.accessControlList(guid)
  const url = `${accountInstanceUri}${namespace}`

  const { data: { value: repoPermissions } } = await axios(
    url,
    bearerTokenHeader(bearerToken)
  )
  return repoPermissions
}

const getIdentityFromDescriptor = accountVsspsUri => bearerToken => async descriptor => {
  const descriptorEndpoint = restEndpoints.identityDescriptor(descriptor)
  const url = `${accountVsspsUri}${descriptorEndpoint}`
  //
  const { data: { value: identity } } = await axios(
    url,
    bearerTokenHeader(bearerToken)
  )
  return identity
}

export {
  getGitSecurityNamespaces,
  getRepoPermissions,
  getIdentityFromDescriptor
}
