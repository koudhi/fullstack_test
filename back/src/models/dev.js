var EntitySchema = require("typeorm").EntitySchema
level = require('./level')
module.exports = new EntitySchema({
  name: "Dev", // Will use table name `category` as default behaviour.
  tableName: "devs", // Optional: Provide `tableName` property to override the default behaviour for table name.
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
    sexo: {
      type: "char",
    },
    datanascimento: {
      type: "date",
    },
    hobby: {
      type: "varchar",
    },
  },
  relations: {
    level: {
      eager: false,
      type: 'many-to-one',
      target: 'Level',
      cascade: true,
      inverseSide: 'dev',
      orphanedRowAction: 'disable',
    },
  },

})