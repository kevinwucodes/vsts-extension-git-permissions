/*
use cases:
  Microsoft.IdentityModel.Claims.ClaimsIdentity;4b4cfc14-2ffd-4e87-8529-0dbb69be47ce\\xxxxxx@ucsb.edu
*/
const identityModelRegex = /(.*ClaimsIdentity)\;([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(.+)/


/*
use cases:
  Microsoft.TeamFoundation.ServiceIdentity;881ef530-18e9-49a4-bbbd-20232a7a282a:Build:5ee28a4d-b6d8-4c95-8820-5fc0b9c25891
  Microsoft.TeamFoundation.Identity;S-1-9-1551374245-1329851764-1745412684-2497984297-1779771285-0-0-0-0-1
*/
const teamFoundationIdentityModelRegex = /Microsoft\.TeamFoundation\.(ServiceIdentity|Identity)/

/*
use cases:
  repoV2/8b2da15f-71df-4904-90e6-b92902a3de1f/f88a9c90-1f8b-4eed-b240-5d29e3ff809d/refs/tags/75007000670072006100640065002d0074006f006d006300610074002d00380035003900
  repoV2/8b2da15f-71df-4904-90e6-b92902a3de1f/f8add4e7-672b-4746-97aa-876f50c1d455
  repoV2/8b2da15f-71df-4904-90e6-b92902a3de1f
*/
const securityTokenRegex = /(repoV2)\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\/?([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})?(.*)?/

/*
use cases:
  undefined
  /refs/tags/75007000670072006100640065002d0074006f006d006300610074002d00380035003900
  /refs/heads/620075006700660069007800/680065006c0070006400650073006b00
  /refs/heads/6d0061007300740065007200
There are only three valid cases according to https://www.visualstudio.com/en-us/docs/integrate/api/security/tokens:
  /refs/heads
  /refs/tags
  /refs/notes
*/
const refRegex = /\/(refs)\/(heads|tags|notes)\/(.*)/

export {
  identityModelRegex,
  teamFoundationIdentityModelRegex,
  securityTokenRegex,
  refRegex
}
