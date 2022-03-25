import { sequelize, Players, Teams, TeamPlayers, Piece, Holds } from "./models.js";

await sequelize.sync({ force: true }); //all table initilizing

// (async()=>{
//     await Players.sync({ force: true});
//     const user = await Players.create({
//       sub : 'alice',
//       nickname : 'husigi',
//       token : 2,
//     });
//     const rows = await sequelize.query('select * from Players');
//     console.log(rows);
// })();

// await TeamPlayers.sync({ force: true });
// await Players.sync({ force: true });
// await Teams.sync({ force: true });

//----------------------------------------2
// const dumyTeam = {
//   hash : 'testhash',
//   title : 'testtitle',
//   description : 'dumydesc',
//   origin: 'dumyorigin',
//   ideaToken: 1,
// }
// const dumyHold = {
//   hash : 'testhash',
//   title : 'testtitle',
//   description : 'dumydesc',
//   origin: 'dumyorigin',
//   reqstake: 50,
//   userId : 1,
// }
// const dumyPlayer = {
//     sub : 'testaddr1',
//     nickname : 'testname1',
//     token : 0,
// }

// const amidala = await Players.create(dumyPlayer);
// const [team, created] = await Teams.findOrCreate({
//     where: { hash: 'testhash' },
//     defaults: dumyTeam,
// });
// if (created) {
//     console.log('o---------crted');
// }

// await Players.count().then(rows => {
//   console.log('v: ', rows);
// })

//await amidala.addTeams(team, { through: { status: 100 }});
// const result = await TeamPlayers.findAll({
//   where: { teamId: 2 },
//   //include: Teams,
// });

// let iter = 0;
// let ideaPoint = 0;
// while(result.length != iter){
//     ideaPoint += result[iter].status;
//     ++iter;
// }
// console.log(ideaPoint);
//----------------------------------3
// let items = [];
const hold = await TeamPlayers.findOne({
    where: { teamId: 1 },
});
console.log('v ', hold.playerId);
// if(hold == null){
//     console.log('not found..');
// }
// else{
//     console.log('v: ', hold);
// }

// const tid = await TeamPlayers.findAll({
//   where: { playerId: 3}
// });

// for(let iter = 0; iter < tid.length; ++iter){
//   items.push(tid[iter].teamId);
// }
// console.log('t: ', items);
//----------------------------------4
// let addr = [];

// const counter = await TeamPlayers.count({
//     where: {teamId : 1},
// })
// console.log('v: ', counter);

// const findUsers = await TeamPlayers.findAll({
//     where: {teamId : 1},
// })
// await Teams.findByPk(findUsers[0].teamId).then(hash => {
//     //console.log('o ', getOrigin.origin);
//     addr.push(hash.origin);
// })

// let iter = 0;
// while(iter != counter){
//     await Players.findByPk(iter + 1).then(user => {
//         //console.log('tm ', user.sub);
//         addr.push(user.sub);
//     });
//     console.log('u: ', findUsers[iter].playerId);
//     ++iter;
// }
// console.log('r ', addr);
// ---------------------------------5
// Holds.destroy({
//     where: {id: 1}
// })
//res.json(counter.rows);