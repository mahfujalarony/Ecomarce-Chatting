const { Sequelize, DataTypes } = require("sequelize");
const config = require("../../config/serviceConfig");

const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
  host: config.dbHost,
  dialect: config.dbDialect || "mysql",
  logging: false,
});

const Conversation = require("./Conversation")(sequelize, DataTypes);
const Message = require("./Message")(sequelize, DataTypes);

// relations
Conversation.hasMany(Message, { as: "messages", foreignKey: "conversationId" });
Message.belongsTo(Conversation, { as: "conversation", foreignKey: "conversationId" });

module.exports = { sequelize, Conversation, Message };
