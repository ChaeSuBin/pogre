async function request(path, options = {}) {
    const url = `http://localhost:3039${path}`;
    const response = await fetch(url, options);
    return response.json();
}
export async function getRest(arg = {}) {
    const params = new URLSearchParams(arg);
    return request(`/restaurants?${params.toString()}`);
}
export async function getTeamsCount() {
    return request(`/teamscount`);
}
export async function getIdeas() {
    return request(`/teamsview`);
}
export async function getIdeaPlayers(_ideaId) {
    return request(`/teamsuser/${_ideaId}`);
}
export async function getPlayers(_playerId) {
    return request(`/playerview/${_playerId}`);
}
export async function getTeamPlayers(_teamId) {
    return request(`/teamplayers/${_teamId}`);
}
export async function putUpdateIdea(record) {
    console.log('v', JSON.stringify(record));
    return request(`/joinidea`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "PUT",
    });
}
export async function postCreateIdea(record) {
    console.log('v', JSON.stringify(record));
    return request(`/ideacreate`, {
      body: JSON.stringify(record),
      headers: {"Content-Type": "application/json"},
      method: "POST",
    });
}
// export async function postUserRegi(record) {
//     console.log('v', JSON.stringify(record));
//     return request(`/usercheck`, {
//       body: JSON.stringify(record),
//       headers: {"Content-Type": "application/json"},
//       method: "POST",
//     });
// }