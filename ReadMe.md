## Test App for Backup's

## Recomended way to use the back-up function

### How to back-up your entries

> Need to use call the Zome: backupChain | ZomeFunction: backup ;
> Recomended to call in the Validation;

~~~
function validateCommit (entryName, entry, header, pkg, sources) {
  var backupEnabled = getBackupApps().length > 0;

  if (validate(entryName, entry, header, pkg, sources)) {
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
function loadBackup() {
  var backup = bridge(getBackupApps()[0].CalleeApp, 'backupChain', 'restore', {});
  return backup
}
~~~
