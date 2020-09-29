import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '../', '.env')
});

const urlstring: any = process.env.DATABASE_URL

const dburl: string = urlstring;

const options: Record<string, Boolean> = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
};
async function connect() {
    try {
        await mongoose.connect(dburl, options, (err) => {
            if (!err) {
                console.log('connected to db success..');
            }
        });
    } catch (e) {
        console.log(e.message);
    }
 
}

export default connect;