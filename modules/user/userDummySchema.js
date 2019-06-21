var mon=require("mongoose");
mon.connect(process.env.DB_URL, { useNewUrlParser: true });

var dummyUserStructure = new mon.Schema({ 
  first_name: String,
  last_name: String,
  avatar: String, 
});

var dummyUserSchema = mon.model('dummyUsers', dummyUserStructure);

module.exports = dummyUserSchema;