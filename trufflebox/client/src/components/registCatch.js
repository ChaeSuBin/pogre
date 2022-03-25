import { getPlayersId, postUserRegi } from "../api.js";

export const registChecker = async(_useraddr) => {
    const playerId = await getPlayersId(_useraddr);
    try{
      console.log('p: ', playerId.id);
      return playerId.id;
    }catch(err){
      //console.error(err);
      playerRegister(_useraddr);
      const playerId = await getPlayersId(_useraddr);
      return playerId.id;
    }
}

const playerRegister = async(_useraddr) => {
    const record = { addr: _useraddr}
    await postUserRegi(record);
}