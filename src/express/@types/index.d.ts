import { UserModel } from "../../models/db/user_schema";

declare global{
    namespace Express {
        interface Request {
            user: UserModel
        }
    }
}
