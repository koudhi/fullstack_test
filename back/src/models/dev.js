const { CHAR } = require('sequelize');

const mongoose = require('mongoose'),
Schema = mongoose.Schema;

// create a schema
const devSchema = new Schema({
    level: String,
    nome: {
        type: String,
        unique: true
    },
    sexo: CHAR,
    datanascimento: Date,
    hobby: String
});

// middleware -----
// make sure that the slug is created from the name
//eventSchema.pre('save', function(next) {
//    this.slug = slugify(this.name);
//    next();
//  });
  
  // create the model
  const devModel = mongoose.model('Dev', devSchema);
  
  // export the model
  module.exports = devModel;
  
  // function to slugify a name
  function slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }