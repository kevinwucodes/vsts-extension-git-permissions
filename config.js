const restEndpoints = {
  securityNamespace: guid =>
    `_apis/securitynamespaces/${guid}/?api-version=4.1-preview`,
  accessControlList: guid =>
    `_apis/accesscontrollists/${guid}/?api-version=4.1-preview&recurse=true`,
  identityDescriptor: descriptor =>
    `_apis/identities?api-version=4.0&descriptors=${descriptor}`
}

export { restEndpoints }
