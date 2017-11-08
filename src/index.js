import loadApp from './app'

VSS.init({
  explicitNotifyLoaded: true,
  usePlatformScripts: true,
  // usePlatformStyles: true
})

VSS.require(
  [
    'VSS/Authentication/Services',
    'TFS/Core/RestClient',
    'TFS/VersionControl/GitRestClient'
  ],
  loadApp
)
