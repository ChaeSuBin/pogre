import Sequelize from "sequelize";

const { DataTypes } = Sequelize;

export const sequelize = new Sequelize(
    "tempdb",      //DB名
    "postgres",      //ユーザー名
    "password",     //パスワード
    {
      dialect: "postgres"   //DBの製品名
    }
);

export const Players = sequelize.define("players", {
    sub: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { underscored: true },
);

export const Teams = sequelize.define(
  "teams",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ideaToken: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    blocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    cycle: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    display: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  { underscored: true },
);

export const TeamPlayers = sequelize.define(
  'team_play',
  {
    status: DataTypes.INTEGER
  },
  { timestamps: false }
);
export const PlayersPiece = sequelize.define(
  'piece_play',
  {},
  { timestamps: false }
);

export const Holds = sequelize.define("holds",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reqstake: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  { underscored: true },
);

export const Piece = sequelize.define(
  "piece",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  { underscored: true },
);

Players.belongsToMany(Teams, { through: TeamPlayers });
Teams.belongsToMany(Players, { through: TeamPlayers });

Players.belongsToMany(Piece, { through: PlayersPiece });
Piece.belongsToMany(Players, { through: PlayersPiece });