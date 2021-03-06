import express from "express";
//import sequelize from "sequelize";
import { sequelize } from "./models.js";
import filestream from "fs";
import sharp from "sharp";
import cors from "cors";
import { 
  Teams, Players, TeamPlayers, 
  Holds, Piece, PlayersPiece 
} from "./models.js";

const app = express();
app.use(cors());
//app.use(express.json());
app.use(express.json({limit: '30mb'})); // jsonをパースする際のlimitを設定
//app.use(express.urlencoded({limit: '30mb', extended: true}));// urlencodeされたボディをパースする際のlimitを設定

const port = process.env.PORT || 3039;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

let bidsTimes = [];

app.get("/", function (req, res) {
    res.send("(╯°ㅁ°)╯︵┻━┻");
});
app.get("/getremaintime/:teamid", async(req, res) => {
  if(bidsTimes[req.params.teamid] == undefined)
    res.json('not set');
  else
    res.json(bidsTimes[req.params.teamid]);
})
app.get("/ideaPoint/:teamid", async(req, res) => {
  const result = await TeamPlayers.findAll({
    where: { teamId: req.params.teamid },
    //include: Teams,
  });
  
  let iter = 0;
  let ideaPoint = [];
  while(result.length != iter){
    ideaPoint.push(result[iter].status);
    ++iter;
  }
  res.json(ideaPoint);
});
app.get("/alert/:teamid", async(req, res) => {
  const hold = await Holds.findAll({
    where: { teamId: req.params.teamid },
  });
  if(hold == null){
      console.log('not found..');
  }
  else{
    res.json(hold);
  }
});
const getOwner = async(_teamId) => {
  const result = await TeamPlayers.findOne({
    where: {teamId: _teamId }
  });
  return result.playerId;
}
app.get('/alertbidptcp/:userid', async(req, res) => {
  let result = [];
  
  const[alerts, temp] = await sequelize.query(`select id, team_id, user_id, tokn, status from holds where status=5`);
  for(let iter = 0; iter < temp.rowCount; ++iter){
    console.log(1, alerts[iter]);
    if(req.params.userid == alerts[iter].user_id){
      result.push(alerts[iter]);
    }
  }
  res.json(result);
})
app.get("/alertbid/:userid", async(req, res) => {
  let result = [];
  
  const[teamId, temp] = await sequelize.query(`select id, team_id, user_id, tokn, status from holds where status=5`);
  //console.log(temp.rowCount);
  
  for(let iter = 0; iter < temp.rowCount; ++iter){
    let teamOwner = await getOwner(teamId[iter].team_id);
    console.log(0, teamOwner);
    console.log(1, teamId[iter]);
    if(req.params.userid == teamOwner){
      result.push(teamId[iter]);
    }
  }
  res.json(result);
});
// app.get("/alertbidshutdown/:userid", async(req, res) => {
//   console.log(30000, req.params.userid);
//   const [hold, meta] = await sequelize.query(`select id, reqstake, description, status, user_id, team_id, tokn from holds where user_id=${req.params.userid} and status=1 or status=2 or status=4`);
//   console.log(hold);
//   console.log(meta.rowCount);
//   if(meta.rowCount == 0){
//     res.json('not found');
//   }
//   else{
//     res.json(hold);
//   }
// });
app.get("/teamplayers/:teamid", async(req, res) => {
  let addr = [];
  const counter = await TeamPlayers.count({
    where: {teamId : req.params.teamid},
  });
  const findUsers = await TeamPlayers.findAll({
      where: {teamId : req.params.teamid},
  });
  await Teams.findByPk(findUsers[0].teamId).then(hash => {
    //console.log('o ', hash);
    addr.push(hash.ideaToken);//hash.title <- is team title
  });
  let iter = 0;
  while(iter != counter){
    await Players.findByPk(findUsers[iter].playerId).then(user => {
      //console.log('tm ', user.sub);
      addr.push(user.sub);
    });
    addr.push(findUsers[iter].status);
    console.log('u: ', findUsers[iter].playerId);
    ++iter;
  }
  res.json(addr);
});
app.get("/teamscount", async(req, res) => {
  const rows = await Teams.findOne({
    attributes: [
      // count(id) as 'countRow'
      [sequelize.fn('COUNT', sequelize.col('id')), 'countRow'],
    ]
  });
  res.json(rows);
});
app.get("/oneidea/:teamid", async (req, res) => {
  const idea = await Teams.findOne({
    where: { id: req.params.teamid },
  });
  res.json(idea);
});
app.get("/getmynft/:title", async(req, res) => {
  Piece.findOne({
    where : {title: req.params.title}
  }).then(data => {
    res.json(data);
  });
})
const checkBlockedIdea = (_ideas) => {
  let result = [];
  for(let iter = 0; iter < _ideas.count; ++iter){
    if(!_ideas.rows[iter].blocked){
      result.push(_ideas.rows[iter]);
    }
  }
  return result
}
app.get("/teamsearch/:querystr", async (req, res) => {
  const limit = +req.query.limit || 5;
  const offset = +req.query.offset || 0;
  const[result, temp] = await sequelize.query(`select id, title, description, idea_token from teams where blocked=false and type=1 and title like '%${req.params.querystr}%'`);
  console.log(13300, result);
  res.json(result);
})
app.get("/teamsview/:nftmode", async (req, res) => {
  const nftmode = req.params.nftmode;
  const mode = parseInt(nftmode, 10);
  const limit = +req.query.limit || 10;
  const offset = +req.query.offset || 0;
  
  if(mode === 1 || mode === 0){
    console.log(10020, mode);
    const ideas = await Teams.findAndCountAll({
      where: { type: mode},
      order: [[sequelize.literal("id"), "DESC"]],
      limit,
      offset,
    });
    const result = checkBlockedIdea(ideas);
    res.json(result);
  }
  else{
    const ideas = await Piece.findAndCountAll({
      order: [[sequelize.literal("id"), "DESC"]],
      limit,
      offset,
    });
    res.json(ideas.rows);
  }
});
app.get("/playpiece/:picid", async(req, res) => {
  await PlayersPiece.findOne({
    where: { pieceId: req.params.picid}
  }).then(user => {
    Players.findOne({
      where: { id: user.playerId }
    }).then(player => {
      res.json(player.sub);
    })
    //console.log('v: ', user.playerId);
  })
})
app.get("/playteams/:playerid", async (req, res) => {
  let items = [];
  const tid = await TeamPlayers.findAll({
    where: { playerId: req.params.playerid}
  });
  
  for(let iter = 0; iter < tid.length; ++iter){
    items.push(tid[iter].teamId);
  }
  res.json(items);
})
app.get("/allplayerspoint", async (req, res) => {
  let pointAmount = 0;
  let rows = await Players.count();
  //console.log(countAllPlayers);
  while(rows > 0){
    await Players.findByPk(rows).then(user => {
      pointAmount += user.token;
    })
    //console.log(pointAmount);
    --rows;
  }
  res.json(pointAmount);
});
app.get("/playerview/:playerid", async (req, res) => {
  const player = await Players.findOne({
    where: { id: req.params.playerid },
  });
  console.log('v: ', player);
  res.json(player);
});
app.get("/playerid/:playeraddr", async (req, res) => {
  await Players.findOne({
    where: {sub: req.params.playeraddr}
  }).then(pid => {
    res.json(pid);
  });
});
app.get("/teamsuser/:ideaid", async (req, res) => {
  const ideas = await TeamPlayers.findAll({
    where: { teamId: req.params.ideaid },
    //order: [[sequelize.literal("id"), "DESC"]],
  });
  console.log('v: ', ideas);
  res.json(ideas);
});
app.get("/readimg/:pictitle", async(req, res) => {
  filestream.readFile(`dcuFileSys/${req.params.pictitle}512.jpg`, function(err, data) {
    if (err) throw err // Fail if the file can't be read.
    //res.header(200, {'Content-Type': 'image/jpeg'})
    res.json(data) // Send the file data to the browser.
  })
});
app.get("/viewimg/:pictitle", async(req, res) => {
  filestream.readFile(`dcuFileSys/${req.params.pictitle}.jpg`, function(err, data) {
    if (err) throw err // Fail if the file can't be read.
    res.writeHead(200, {'Content-Type': 'image/jpeg'})
    res.end(data) // Send the file data to the browser.
  })
});
app.get("/viewdocx/:docxtitle", async(req, res) => {
  filestream.readFile(`dcuFileSys/${req.params.docxtitle}.docx`, function(err, data) {
    if (err) throw err // Fail if the file can't be read.
    res.writeHead(200, {'Content-Type': 'application/msword'})
    res.end(data) // Send the file data to the browser.
  })
});
app.get("/downloadfile/:filename", async(req, res) => {
  //res.download(`dcuFileSys/${req.params.filename}.docx`);
  filestream.readFile(
    `dcuFileSys/${req.params.filename}.docx`, function(err, data) {
    if (err) throw err
    const fileName = encodeURIComponent(`${req.params.filename}.docx`);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename=${fileName}`});
    res.status(200).send(data);
  })
});
app.put("/nftlimit", async(req, res) => {
  await Piece.findByPk(req.body.pieceId).then(piece => {
    piece.limit -= 1;
    piece.save();
    console.log('0----------limit');
  })
})
app.put("/blockset", async(req, res) => {
  await Teams.findByPk(req.body.teamId).then(team => {
    team.blocked = req.body.blocked;
    team.display = req.body.display;
    team.save();
    console.log(10001);
  })
});
app.put("/blockexit", async(req, res) => {
  await Teams.findByPk(req.body.teamId).then(team => {
    team.blocked = req.body.block;
    team.save();
    console.log(80001);
  })
});
app.put("/priceupdate", async(req, res) => {
  await Teams.findByPk(req.body.teamId).then(team => {
    team.ideaToken = req.body.price;
    team.save();
    console.log(12000);
  })
});
app.put("/alertupdate", async(req, res) => {
  await Holds.findByPk(req.body.holdId).then(hold => {
    hold.status = req.body.status;
    hold.save();
    console.log(10002);
  })
});
app.put("/tokenudt", async(req, res) => {
  const player = await Players.findOne({
    where: { sub: req.body.useraddr }
  })
  // console.log('v: ',player.token);
  // console.log('e: ',parseInt(req.body.token));
  // console.log('r: ', player.token + parseInt(req.body.token));
  if(player != null){
    if(req.body.mode == 'min'){
      player.token -= parseInt(req.body.token);
    }
    else{
      player.token += parseInt(req.body.token);
    }
    await player.save();
  }
});
const setDsplayAndGetWinner = async(_teamId) => {
  sequelize.query(`update teams set blocked=true where id=${_teamId}`);
  
  const winner = await sequelize.query(`select * from team_plays where "team_plays"."teamId"=${_teamId} and status != 100 order by status desc`);
  console.log(winner[0][0].playerId);

  const rows = await Holds.max('id') + 1;
  await Holds.findOrCreate({
    where: {id: rows },
    defaults: {
      teamId: winner[0][0].teamId,
      tokn: winner[0][0].status,
      userId: winner[0][0].playerId,
      status: 5
    }
  }).then(([hold, created]) => {
    if(created){
      console.log(18800);
    }
  });
}
const calcExpired = async(_teamId) => {
  bidsTimes[_teamId] = 100000;
  // const winner = await sequelize.query(`select * from team_plays where "team_plays"."teamId"=13 and status != 100 order by status desc`);
  // console.log(winner[0][0].status);

  // setTimeout(() => {
  //   const [winner, countRow] = sequelize.query(`select * from team_plays where "team_plays"."teamId"=${_teamId} and status != 100 order by status desc`);
  //   console.log(winner[0]);
  // }, doneTime);
  
  const timer = setInterval(() => {
    bidsTimes[_teamId] -= 1000;
    if(bidsTimes[_teamId] < 0){
      console.log(9999);
      clearInterval(timer);
      setDsplayAndGetWinner(_teamId);
    }
  }, 1000);
}
app.put("/bididea", async(req, res) => {
  const putToken = req.body.bidtoken;
  const team = await Teams.findOne({
    where: { id: req.body.teamid },
  });
  if(team != null){
    team.ideaToken = putToken;
    await team.save();
  }
  const player = await Players.findOne({
    where: { id: req.body.userid }
  });
  
  const result = await player.addTeams(team, { through: { status: putToken }});
  console.log(12001, result);
  console.log(79000, req.body.first);
  if(req.body.first){
    // setTimeout(calcExpired, 20000, req.body.teamid);
    calcExpired(req.body.teamid);
  }
})
app.put("/fundidea", async(req, res) => {
  console.log(10000);
  const team = await Teams.findOne({
    where: { title: req.body.name },
  });
  // if(team != null){
  //   team.ideaToken += 1;
  //   await team.save();
  // }
  const player = await Players.findOne({
    where: { id: req.body.userid }
  });
  TeamPlayers.findOne({
    where: {
      [sequelize.Op.and]: {
        playerId: player.id,
        teamId: team.id
      }
    }
  }).then(history => {
    if(history == null){
      (async () => {
        await player.addTeams(team, { through: { status: req.body.stake }});
      })();
    }
    else{
      const tempa = Number(history.status);
      const tempb = Number(req.body.stake);
      const result = tempa + tempb;
      console.log(result);
      (async () => {
        await player.addTeams(team, { through: { status: result}});
      })();
    }
  });
});
app.put("/joinidea", async(req, res) => {
  const team = await Teams.findOne({
    where: { id: req.body.teamid },
  });
  console.log(10001);
  const player = await Players.findOne({
    where: { id: req.body.userid }
  });
  console.log(10002);

  const teamPlayer = await TeamPlayers.findOne({
    where: { teamId: req.body.teamid}
  })
  if(teamPlayer != null){
    console.log(10003);
    console.log(teamPlayer.status);
    teamPlayer.status -= req.body.stake;
    await teamPlayer.save();
  }
  // await TeamPlayers.findOne({
  //   where: { teamId: req.body.teamid}}).then(owner => {
  //     owner.status -= req.body.stake;
  //     save
  //   })
  await player.addTeams(team, { through: { status: req.body.stake }});
})
const uploadfile = async(_req) => {
  const idxContents = `{"title":"${_req.body.name}","description":"${_req.body.desc}"}`;
  filestream.writeFile(
    `idxFileSys/${_req.body.name}.json`, idxContents, (err) => {
    if (err) { 
      throw err;
    }
    console.log('jsonが作成されました');
  })
};
const uploadocu = async(_req, nftmode) => {
  const data = Buffer.from(_req.body.fbolb);
  console.log(data);
  console.log('t :', typeof data);
  if(nftmode){
    filestream.writeFile(
      `dcuFileSys/${_req.body.name}.jpg`, data, (err) => {
      if (err) { 
        throw err;
      }
      sharp(data)
      .resize(315)
      .toFile(`dcuFileSys/${_req.body.name}512.jpg`, (err, info) => {
        if(err){
          throw err
        }
        console.log(info);
      })
      console.log('jpgが作成されました');
    })
  }
  else{
    filestream.writeFile(
      `dcuFileSys/${_req.body.name}.docx`, data, (err) => {
      if (err) { 
        throw err;
      }
      console.log('wordが作成されました');
    })
  }
}
app.post("/requirenego", async(req, res) => {
  const rows = await Holds.max('id') + 1;
  console.log(rows);
  const record = {
    teamId: req.body.teamid,
    tokn : req.body.bidtoken,
    userId : req.body.userid,
    status: req.body.status
  }
  console.log(record);
  await Holds.findOrCreate({
    where: { id: rows },
    defaults: record
  }).then(([hold, created]) => {
    if(created){
      console.log(10002);
    }
  });
});
app.post("/requirejoin", async(req, res) => {
  let status = 0;
  const rows = await Holds.count() + 1;
  console.log(rows);
  if(req.body.purchase)
    status = 3;
  console.log(req.body.purchase);
  console.log(status);
  const record = {
      teamId: req.body.teamid,
      description : req.body.desc,
      tokn: req.body.tokn,
      reqstake: req.body.putstake,
      userId : req.body.userid,
      status: status
  }
  console.log(record);
  await Holds.findOrCreate({
    where: { id: rows },
    defaults: record
  }).then(([hold, created]) => {
    if(created){
      console.log(10001);
    }
  });
});
app.post("/nftcreate", async(req, res) => {
  console.log('n---------------', req.body);
  const [player, pcreated] = await Players.findOrCreate({
    where: { sub: req.body.useraddr },
    defaults: {
      nickname: 'N/A',
      token: 0,
    },
  });
  if (!pcreated) {
    player.nickname = 'NA';
    await player.save();
  }
  await Piece.findOrCreate({
    where: { title: req.body.name },
    defaults: {
      title: req.body.name,
      description: req.body.desc,
      price: req.body.price,
      limit: req.body.limit,
    },
  }).then(([piece, created]) => {
    if(created){
      uploadocu(req, true);
      player.addPiece(piece, { through: {selfGranted: false}});
      const result = Players.findOne({
        where: { sub: req.body.useraddr },
        include: Piece,
      });
      console.log(result);
      console.log('o---------crted');
    }
  });
});
app.post("/ideacreate", async(req, res) => {
  console.log(40000, req.body);
  
  const [team, created] = await Teams.findOrCreate({
    where: { title: req.body.name },
    defaults: {
      title: req.body.name,
      description: req.body.desc,
      ideaToken: req.body.price,
      type: req.body.mode,
      file: false,
      blocked: false,
    },
  });
  if (!created) {
    // team.nickname = req.body.username;
    // await team.save();
    console.log('---------team');
  }

  const [player, pcreated] = await Players.findOrCreate({
    where: { sub: req.body.useraddr },
    defaults: {
      nickname: 'N/A',
      token: 0,
    },
  });
  if (!pcreated) {
    player.nickname = 'NA';
    await player.save();
  }

  await player.addTeams(team, { through: { status: 100 }});
  const result = await Players.findOne({
    where: { sub: req.body.useraddr },
    include: Teams,
  });
  if(req.body.fbolb !== null){
    sequelize.query(`update teams set file=true where id=${team.id}`);
    console.log(4000);
    uploadocu(req, false);
  }
  //uploadfile(req);
  console.log(result);
});
app.post("/regiplayer", async(req, res) => {
  await Players.create({
    sub: req.body.addr,
    nickname: 'auto',
    token: 0,
  });
});
app.delete("/dlthold/:holdId", async(req, res) => {
  await Holds.destroy({
    where: {id: req.params.holdId}
  })
  console.log('o------destroyed')
});
app.delete("/dltteam/:teamId", async(req, res) => {
  await Teams.destroy({
    where: {id: req.params.teamId}
  })
  console.log('o------destroyed')
});
// app.post("/usercheck", async(req, res) => {
//   const [player, created] = await Players.findOrCreate({
//     where: { sub: req.body.hash },
//     defaults: {
//       nickname: req.body.name,
//       token: req.body.desc,
//     },
//   });
//   if (!created) {
//     // team.nickname = req.body.username;
//     // await team.save();
//     console.log('---------creted');
//   }
// });