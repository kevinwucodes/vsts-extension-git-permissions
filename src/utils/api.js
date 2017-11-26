import axios from 'axios'
import { restEndpoints, IDENTITY_DESCRIPTOR_CACHE } from '../../config'

//reinitialize request cache
caches.delete(IDENTITY_DESCRIPTOR_CACHE).then(bool => {
  console.log('IDENTITY_DESCRIPTOR_CACHE was reinitialized', bool)
})

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

  const headers = new Headers()
  headers.append('Authorization', bearerToken)

  const { value: identity } = await cacher(IDENTITY_DESCRIPTOR_CACHE, url, {
    method: 'GET',
    headers
  })

  return identity
}

const cacher = async (cacheName, request, options) => {
  const cache = await caches.open(cacheName)

  const cachedRequest = await cache.match(request)

  if (cachedRequest) {
    return await cachedRequest.json()
  } else {
    const response = await fetch(request, options)

    await cache.put(request, response.clone())

    return await response.json()
  }
}

export {
  getGitSecurityNamespaces,
  getRepoPermissions,
  getIdentityFromDescriptor
}
