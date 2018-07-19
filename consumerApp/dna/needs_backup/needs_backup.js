'use strict';

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

// -----------------------------------------------------------------
//  Exposed functions
// -----------------------------------------------------------------

function profileCreate (profileEntry) {
  var profileHash = commit("profile", profileEntry);
  return profileHash;
}

function profile_stringCreate (profile_stringEntry) {
  var profile_stringHash = commit("profile_string", profile_stringEntry);
  return profile_stringHash;
}

function testingAnchorsAndLinks(profile_stringEntry){
  hash = commit("profile_string", profile_stringEntry);
  commit('profile_link', {
    Links: [ { Base: anchor(App.DNA.Hash,""), Link: hash, Tag: 'profile' } ]
  });
  return hash
}

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

// -----------------------------------------------------------------
//  The Genesis Function https://developer.holochain.org/genesis
// -----------------------------------------------------------------

/**
 * Called only when your source chain is generated
 * @return {boolean} success
 */
function genesis () {
//Testing
  return true;
}

function bridgeGenesis(side, dna, appData) {
  // this is where all existing entries should be backed up!
  return true;
}

// -----------------------------------------------------------------
//  Validation functions for every change to the local chain or DHT
// -----------------------------------------------------------------

function validateCommit (entryName, entry, header, pkg, sources) {
  // debug("entry_type:"+entryName+"entry"+JSON.stringify(entry)+"header"+JSON.stringify(header)+"PKG: "+JSON.stringify(pkg)+"sources"+sources);

  if (validate(entryName, entry, header, pkg, sources)) {
    backupCommit(entryName, entry, header);
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
    case "profile_link":
      return true;
    default:
      return false;
  }
}

function validatePut (entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "profile":
      return false;
    case "profile_string":
      return false;
    default:
      return false;
  }
}


function validateMod (entryName, entry, header, replaces, pkg, sources) {
  switch (entryName) {
    case "profile":
      return false;
    case "profile_string":
      return false;
    default:
      return false;
  }
}

function validateDel (entryName, hash, pkg, sources) {
  switch (entryName) {
    case "profile":
      return false;
    case "profile_string":
      return false;
    default:
      return false;
  }
}

function validateLink (entryName, baseHash, links, pkg, sources) {
  switch (entryName) {
    case "profile_link":
      return true;
    case "profile_string":
      return false;
    default:
      return false;
  }
}

function validatePutPkg (entryName) {
  return null;
}

function validateModPkg (entryName) {
  return null;
}

function validateDelPkg (entryName) {
  return null;
}

function validateLinkPkg (entryName) {
  return null;
}
