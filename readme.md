# Git Permissions Viewer

This is a VSTS extension that provides a view into who has what type of access in your project git repositories.

The extension is currently under private beta and should work in most evergreen browsers.  Internet Explorer is not supported.

## Requirements
* a NodeJS runtime supporting async/await
* the `tfx-cli` runtime, which can be installed globally by running `npm install -g tfx-cli`

## Build
```script
npm install
```

## Develop
```script
npm run dev
```

## Package and upload
```script
npm run package
```


## TODOs
* cache identity descriptors lookup due to massive network lookup required
* after identity lookup, identities should be followed through to get identity metadata, e.g (
https://app.vssps.visualstudio.com/xxxxxxx/_apis/Identities/xxxxxxxxx)
* see TODOs sprinkled through code
* logo needed for extension
* bug in the `document.documentElement.clientHeight` due to offset of VSTS header
* add deny permissions
