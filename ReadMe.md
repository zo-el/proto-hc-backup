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
This triggers the following actions:

## Test App for Backup's

## Recomended way to use the back-up function

### How to back-up your entries

> Need to use call the Zome: backupChain | ZomeFunction: backup ;
> Recomended to call in the Validation;

backupCommit Function:
~~~
// -----------------------------------------------------------------
//  Backup Functions
// -----------------------------------------------------------------

function backupCommit(entryName, entry, header){
  var backupEnabled = getBackupApps().length > 0;

  if (backupEnabled) {
    debug("consumerApp: Calling backup App!");
    var backup_commit = {
    sourceAppDNA:App.DNA.Hash,
    header: {
      type : entryName,
      sig : JSON.parse(header.Sig.replace(/ /g,',').replace(/['{''}']/g, '')),
      hash : makeHash(entryName,entry),
      time : header.Time,
      nextHeader : header.NextHeader,
      next : entryName+" :"+header.Next,
      entry : header.EntryLink,
    },
    content:entry,
    }
    bridge(getBackupApps()[0].CalleeApp, 'backupChain', 'backup', backup_commit);
  }
}
~~~


Validation Functions:
~~~

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

~~~


### Need to Load the Chain back
> need to call Zome: backupChain | ZomeFunction: restore

~~~
// -----------------------------------------------------------------
//  Backup Functions
// -----------------------------------------------------------------

function loadBackup() {
  var backup = bridge(getBackupApps()[0].CalleeApp, 'backupChain', 'restore', {});
  return backup
}

function getBackupAppsHash() {
  return backupApps = getBridges().filter(function(elem) {
    return elem.CalleeName === 'backupApp'
  });
}
~~~
