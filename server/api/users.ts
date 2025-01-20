import { User } from "~/server/models/user.model";

export default defineEventHandler(async (event) => {
    const users = await User.findOneAndUpdate({name: "Ned Stark"}, {email: "666"})
    console.log(users);
    return users
})