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
  securityTokenRegex,
  refRegex
}
