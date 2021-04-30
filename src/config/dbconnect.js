const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/f8_education_dev', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('Connection Sucessfully!');
    } catch (error) {
        console.log('Connection Failure!');
    }
}
// async function connect() {
//     try {
//         await mongoose.connect(
//             'mongodb+srv://hieuluu:hieuluu123@cluster0.uzxq5.mongodb.net/f8_education_dev?retryWrites=true&w=majority',
//             {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true,
//                 useCreateIndex: true,
//             },
//         );
//         console.log('Connection Sucessfully!');
//     } catch (error) {
//         console.log('Connection Failure!');
//     }
// }
module.exports = { connect };
