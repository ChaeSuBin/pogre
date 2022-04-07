import express from "express";
import sequelize from "sequelize";
import filestream from "fs";
import sharp from "sharp";
import cors from "cors";
import { Teams, Players, TeamPlayers, 
  Holds, Piece, PlayersPiece } from "./models.js";
import { info } from "console";

const app = express();
app.use(cors());
//app.use(express.json());
app.use(express.json({limit: '30mb'})); // jsonをパースする際のlimitを設定
//app.use(express.urlencoded({limit: '30mb', extended: true}));// urlencodeされたボディをパースする際のlimitを設定

const port = process.env.PORT || 3039;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

app.get("/", function (req, res) {
    res.send("(╯°ㅁ°)╯︵┻━┻");
});
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
app.get("/alert/:title", async(req, res) => {
  const hold = await Holds.findOne({
    where: { title: req.params.title },
  });
  if(hold == null){
      console.log('not found..');
  }
  else{
    res.json(hold);
  }
});
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
app.get("/teamsview/:nftmode", async (req, res) => {
  const nftmode = req.params.nftmode;

  const limit = +req.query.limit || 5;
  const offset = +req.query.offset || 0;
  if(nftmode === 'idea'){
    const ideas = await Teams.findAndCountAll({
      order: [[sequelize.literal("id"), "DESC"]],
      where: {display: true},
      limit,
      offset,
    });
    res.json(ideas.rows);
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
app.get("/downloadfile/:filename", async(req, res) => {
  //res.download(`dcuFileSys/${req.params.filename}.docx`);
  filestream.readFile(
    `dcuFileSys/${req.params.filename}.docx`, function(err, data) {
    if (err) throw err
    const fileName = encodeURIComponent(`${req.params.filename}.docx`);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename=${fileName}.docx`});
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
    console.log('blockset');
  })
});
app.put("/blockexit", async(req, res) => {
  await Teams.findByPk(req.body.teamId).then(team => {
    team.blocked = req.body.blocked;
    team.ideaToken = req.body.price;
    team.save();
    console.log('o---------blcoexit');
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
app.put("/viewidea", async(req, res) => {
  const team = await Teams.findOne({
    where: { title: req.body.name },
  });
  if(team != null){
    team.ideaToken += 1;
    await team.save();
  }
})
app.put("/fundidea", async(req, res) => {
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
    where: { title: req.body.name },
  });
  const player = await Players.findOne({
    where: { id: req.body.userid }
  });
  
  await player.addTeams(team, { through: { status: req.body.stake }});
  if(team != null){
    team.description = req.body.desc;
    await team.save();
  }
});
// app.post("/uploadfile", async(req, res) => {
//   const idxContents = `{"title":"${req.body.name}","description":"${req.body.desc}"}`;
//   filestream.writeFile(
//     `idxFileSys/${req.body.name}.json`, idxContents, (err) => {
//     if (err) { 
//       throw err;
//     }
//     console.log('jsonが作成されました');
//   })
// });
const uploadfile = async(_req) => {
  const idxContents = `{"title":"${_req.body.name}","description":"${_req.body.desc}"}`;
  filestream.writeFile(
    `idxFileSys/${_req.body.name}.json`, idxContents, (err) => {
    if (err) { 
      throw err;
    }
    console.log('jsonが作成されました');
  })
}
// app.post("/uploadocu", async(req, res) => {
//   const data = Buffer.from(req.body.fbolb);
//   console.log(data);
//   console.log('t :', typeof data);
//   filestream.writeFile(
//     `dcuFileSys/${req.body.name}.docx`, data, (err) => {
//     if (err) { 
//       throw err;
//     }
//     console.log('wordが作成されました');
//   })
// });
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
app.post("/requirejoin", async(req, res) => {
  const reqTeam = {
  title : req.body.name,
  description : req.body.desc,
  reqstake: req.body.putstake,
  userId : req.body.userid,
  }
  console.log('test: ====================', reqTeam);
  await Players.findOrCreate({
    where: { sub: req.body.useraddr },
    defaults: {
      nickname: 'auto-gen',
      token: 0,
    },
  }).then(([player, created]) => {
    if(created){
      console.log('o--------------create');
      player.save();
    }
    else{
      console.log('x==============create');
    }
  });
  const [team, created] = await Holds.findOrCreate({
      where: { title: req.body.name },
      defaults: reqTeam,
  });
  if (created) {
      console.log('o---------crted');
  }
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
  console.log('k---------------', req.body.price);
  
  const [team, created] = await Teams.findOrCreate({
    where: { title: req.body.name },
    defaults: {
      title: req.body.name,
      description: req.body.desc,
      ideaToken: req.body.price,
      cycle: req.body.cycle,
      display: req.body.display,
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
  uploadocu(req, false);
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