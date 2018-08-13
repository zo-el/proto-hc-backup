# Holochain Chain Backup App
This document covers the sequences of recovering a local chain in the case of data loss using a backup app

## Creating Backups
- Any app wishing to allow restore from backup functionality must bridge to the backup app
- In validateCommit (adding anything to local chain) it must also call a backup function across the bridge and pass it the data to be added
- This data will be encrypted and stored on the backup app DHT including all metadata (timestamp, sources, signature etc.).


## Restoring from backup
- Install Holochain which lead you to install DPKI
- Install the backup app with identical DNA to the one that was used to create the backup
- Use the DPKI to restore you Backup app Public key
- Use the following call for installing your apps.  
```
hcadmin restore ./apprepo backupAppName
```
### This triggers the following actions:
-

**Table of Contents**

<!-- TOC depthFrom:2 depthTo:4 withLinks:1 updateOnSave:1 orderedList:0 -->

- [How to use it in your app ?](#how-to-use-it-in-your-app-?)
	- [Add the backup Zome](#Add-the-backup-Zome)
	- [How to back-up your entries ?](#How-to-back-up-your-entries)
  - [When do we backup ?](#How-to-back-up-your-entries)
  - [Need to backup the old entries ?](#How-to-back-up-your-entries)
  - [For testing your backup](#How-to-back-up-your-entries)

<!-- /TOC -->

## How to use it in your app ?
> Note: Recomended way to use the back-up function

### Add the backup Zome

> Need to use bridge the Zome: backupChain | ZomeFunction: backup ;

```
function genesis(){
  return true;
}
// -----------------------------------------------------------------
//  Backup Functions
// -----------------------------------------------------------------

// payload : {entryName, entry, header}
function backupCommit(payload){
  var backupEnabled = getBackupAppsHash().length > 0;
 debug("Header: "+JSON.stringify(payload.header))
  if (backupEnabled) {
    debug("consumerApp: Calling backup App!");
    var backup_commit = {
    sourceAppDNA:App.DNA.Hash,
    header: {
      type : payload.entryName,
      sig : payload.header.Signature,
      hash : makeHash(payload.entryName,payload.entry),
      time : payload.header.Time,
      nextHeader : payload.header.HeaderLink,
      next : payload.entryName+" :"+payload.header.TypeLink,
      entry : payload.header.EntryLink,
    },
    content:payload.entry,
    }
    debug("Sending to be backed up --->"+JSON.stringify(backup_commit));
    bridge(getBackupAppsHash()[0].CalleeApp, 'backupChain', 'backup', backup_commit);
  }
}

function loadBackup() {
  var backup = bridge(getBackupAppsHash()[0].CalleeApp, 'backupChain', 'restore', {"Hash":App.DNA.Hash});
  return backup
}

function getBackupAppsHash() {
  return backupApps = getBridges().filter(function(elem) {
    return elem.CalleeName === 'backupApp'
  });
}

function backupAll() {

  debug('about to query')
  var allEntries = query({
    Return: {
      Hashes: true,
      Entries: true,
      Headers:true
    }
  });

  allEntries.forEach(function (entry){
      backupCommit({entryName:entry.Header.Type,entry:entry.Entry,header:entry.Header})
  });
}
```

### How to back-up your entries

> Need to call the backup zome functions

```
// -----------------------------------------------------------------
//  Callback Backup Functions
// -----------------------------------------------------------------

function backupCommit(entryName,entry,header) {
  return call('backup', 'backupCommit', {
    entryName : entryName,
    entry : entry,
    header : header
  });
}
```

### When do we backup ?

> Recomendation : call it when you commit an entry so that every entry is backed-up
> you can do this is the validateCommit Function
```

function validateCommit (entryName, entry, header, pkg, sources) {
  if (validate(entryName, entry, header, pkg, sources)) {
    backup(entryName, entry, header);
    return true;
  }
  return false;
}

function validate(entryName, entry, header, pkg, sources){
  switch (entryName) {
    case "profile":
      return true;
    case "profile_string":
      return true;
    default:
      return false;
  }
}

```


### Need to backup the old entries ?
> If you have not bridged to the app and later you wish to backup. you would have to call the backupAll Function in the backup Zome

```
function backupAll() {
  debug('about to query')
  var allEntries = query({
    Return: {
      Hashes: true,
      Entries: true,
      Headers:true
    }
  });
  allEntries.forEach(function (entry){
      backupCommit({entryName:entry.Header.Type,entry:entry.Entry,header:entry.Header})
  });
}
```
### For testing your backup
> If you want to check you backup entries you can call the loadBackup Function in the backup Zome.

```
function loadBackup() {
  var backup = bridge(getBackupApps()[0].CalleeApp, 'backupChain', 'restore', {});
  return backup
}
```
