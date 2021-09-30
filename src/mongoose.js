var mongoose = require('mongoose');
const { PassThrough } = require('stream');
mongoose.connect("mongodb+srv://Madhumitha:madhu@cluster0.0knrm.mongodb.net/Demo?retryWrites=true&w=majority");
 var t = mongoose.connection
t.on(('open'),()=>
{
   console.log("Hi makale")
})

 //console.log("Hi makale")
const schema = new mongoose.Schema(
   {
      name:
      {
         type : String

      },
      mail:
      {
         type : String

      },
      pass:
      {
          type: String
      }
   }
)
module.exports = mongoose.model('Userdetails',schema)

