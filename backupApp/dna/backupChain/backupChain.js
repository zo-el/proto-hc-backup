
/*=============================================
=            Public Zome Functions            =
=============================================*/

/**
 * Backs up an entry
 *
 * @param      {Object}  entry  A local chain entry object to back up                                                                                       `
 */
function backup(entry) {
  debug('commiting backup entry')
  var hash = commit('chainEntry', entry);
  debug("entry stored at: "+hash);
  commit('entryLink', {
    Links: [ { Base: anchor(entry.sourceAppDNA,App.Key.Hash), Link: hash, Tag: 'backup' } ]
  });
  return hash;
}

// backup a list of entries
function backupBatch(entries) {
  entries.forEach(backup);
  return true; // in future check for success before returning true
}

/**
 * Restores an entire local chain and returns it in json object representation
 */
function restore(sourceApp) {
  debug('restoring chain')
  var entries = getLinks(anchor(sourceApp.Hash,App.Key.Hash), 'backup', {Load: true});
  debug(JSON.stringify(entries, null, 2))
  return entries;
}

/*=====  End of Public Zome Functions  ======*/

/*----------  Anchor API  ----------*/

function anchor(anchorType, anchorText) {
  return call('anchors', 'anchor', {
    anchorType: anchorType,
    anchorText: anchorText
  }).replace(/"/g, '');
}

function anchorExists(anchorType, anchorText) {
  return call('anchors', 'exists', {
    anchorType: anchorType,
    anchorText: anchorText
  });
}

/*==========================================
=             Callbacks                    =
==========================================*/

function bridgeGenesis(side, dna, appData) {
  return true;
}


function genesis () {
  return true;
}


function validateCommit (entryType, entry, header, pkg, sources) {
  return true;
}


function validatePut (entryType, entry, header, pkg, sources) {
  return true;
}


function validateMod (entryType, entry, header, replaces, pkg, sources) {
  return true;
}

function validateDel (entryType, hash, pkg, sources) {
  return true;
}

function validateLink(entryType, hash, links, pkg, sources) {
  return true;
}


function validatePutPkg (entryType) {
  return null;
}


function validateModPkg (entryType) {
  return null;
}


function validateDelPkg (entryType) {
  return null;
}

/*=====  End of  Callbacks  ======*/
