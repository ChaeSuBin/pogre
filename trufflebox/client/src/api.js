async function request(path, options = {}) {
    // const url = `http://localhost:3039${path}`;
    const url = `http://121.190.220.159:3039${path}`;
    const response = await fetch(url, options);
    return response.json();
}
export async function getRest(arg = {}) {
    const params = new URLSearchParams(arg);
    return request(`/restaurants?${params.toString()}`);
}
export async function getIdeaPoints(_teamId) {
    return request(`/ideaPoint/${_teamId}`);
}
export async function getHold(_teamId) {
    return request(`/alert/${_teamId}`);
}
export async function getHoldBidPtcp(_userId) {
    return request(`/alertbidptcp/${_userId}`);
}
export async function getHoldBid(_userId) {
    return request(`/alertbid/${_userId}`);
}
export async function getTeamsCount() {
    return request(`/teamscount`);
}
export async function getMintedTokn() {
    return request(`/allplayerspoint`);
}
export async function getIdeas(_nftmode) {
    return request(`/teamsview/${_nftmode}`);
}
export async function getOwnNft(_nftmeta) {
    return request(`/getmynft/${_nftmeta}`);
}
export async function getIdeaPlayers(_ideaId) {
    return request(`/teamsuser/${_ideaId}`);
}
export async function getPicPlayers(_picId) {
    return request(`/playpiece/${_picId}`);
}
export async function getImgView(_picTitle) {
    return request(`/viewimg/${_picTitle}`);
}
export async function getImgBlob(_picTitle) {
    return request(`/readimg/${_picTitle}`);
}
export async function getDcuDown(_docTitle) {
    console.log(_docTitle);
    return request(`/downloadfile/${_docTitle}`);
}
export async function getIdeaOne(_teamId) {
    return request(`/oneidea/${_teamId}`);
}
export async function getPlayers(_playerId) {
    return request(`/playerview/${_playerId}`);
}
export async function getTeams(_playerId) {//show teamids of the 
    return request(`/playteams/${_playerId}`);//player ptcp in
}
export async function getPlayersId(_playerAddr) {
    return request(`/playerid/${_playerAddr}`);
}
export async function getTeamPlayers(_teamId) {
    return request(`/teamplayers/${_teamId}`);
}
export async function getSearchIdea(_query) {
    return request(`/teamsearch/${_query}`);
}
export async function getRemainTime(_teamId) {
    return request(`/getremaintime/${_teamId}`);
}
export async function putUpdateBlock(record) {
    console.log('v', JSON.stringify(record));
    return request(`/blockset`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "PUT",
    });
}
export async function putExitBlock(record) {
    return request(`/blockexit`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "PUT",
    });
}
export async function putPrice(record) {
    console.log('v', JSON.stringify(record));
    return request(`/priceupdate`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "PUT",
    });
}
export async function putUpdateHold(record) {
    console.log('v', JSON.stringify(record));
    return request(`/alertupdate`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "PUT",
    });
}
export async function putUpdateTokn(record) {
    console.log('v', JSON.stringify(record));
    return request(`/tokenudt`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "PUT",
    });
}
export async function putUpdateIdea(record) {
    console.log('v', JSON.stringify(record));
    return request(`/joinidea`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "PUT",
    });
}
export async function putBidIdea(record) {
    console.log('v', JSON.stringify(record));
    return request(`/bididea`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "PUT",
    });
}
export async function putFundIdea(record) {
    console.log('v', JSON.stringify(record));
    return request(`/fundidea`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "PUT",
    });
}
export async function putNftLimit(record) {
    console.log('v', JSON.stringify(record));
    return request(`/nftlimit`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "PUT",
    });
}
// export async function postFileIdx(stream) {
//     console.log('v', JSON.stringify(stream));
//     return request(`/uploadfile`, {
//       body: JSON.stringify(stream),
//       headers: {"Content-Type": "application/json"},
//       method: "POST",
//     });
// }
// export async function postFileDoc(docu) {
//     console.log('v', JSON.stringify(docu));
//     return request(`/uploadocu`, {
//       body: JSON.stringify(docu),
//       headers: {"Content-Type": "application/json"},
//       method: "POST",
//     });
// }
export async function postHold(record) {
    console.log('v', JSON.stringify(record));
    return request(`/requirenego`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "POST",
    });
}
export async function postHoldIdea(record) {
    console.log('v', JSON.stringify(record));
    return request(`/requirejoin`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "POST",
    });
}
export async function postCreateNft(record) {
    console.log('v', JSON.stringify(record));
    return request(`/nftcreate`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "POST",
    });
}
export async function postCreateIdea(record) {
    //console.log('v', JSON.stringify(record));
    return request(`/ideacreate`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "POST",
    });
}
export async function postUserRegi(record) {
    console.log('v', JSON.stringify(record));
    return request(`/regiplayer`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "POST",
    });
}
export async function dltHold(_holdId) {
    console.log('v', _holdId);
    return request(`/dlthold/${_holdId}`, {
      headers: {"Content-Type": "application/json"},
      method: "DELETE",
    });
}
export async function dltTeam(_holdId) {
    console.log('v', _holdId);
    return request(`/dltteam/${_holdId}`, {
      headers: {"Content-Type": "application/json"},
      method: "DELETE",
    });
}