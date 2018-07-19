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


  // return bridge(getBackupAppsHash()[0].CalleeApp, 'backupChain', 'backupBatch', allEntries);
}
