# Git Permissions Viewer

This is a VSTS extension that provides a view into who has what type of access in your project git repositories.

The extension is located here: XXXXXXXXXXXX

## Requirements
* probably at least Node v8.7

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
* add filterable by entityName
