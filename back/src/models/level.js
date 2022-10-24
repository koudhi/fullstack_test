var EntitySchema = require("typeorm").EntitySchema
dev = require('./dev')

module.exports = new EntitySchema({
  name: "Level", // Will use table name `category` as default behaviour.
  tableName: "levels", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    nome: {
      type: "varchar",
      unique: true,
    },
    numberOfDevs: {
      type: "int",
      unique: false,
    },
  },
  relation: {
    dev: {
      type: 'one-to-many',
      target: 'Dev',
      cascade: true,
      inverseSide: 'level',
    },
  },
})