import { PrismaClient } from "@prisma/client";
import { getHashedPassword_async, checkPassword, generateAccessToken }  from "../middleware/users.middleware";
import { calculateUserAge } from "../helpers/users.helper"
;
export interface CreateUserType {
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    dob: string
};

export interface UpdateUserType {
    user_firstname: string,
    user_lastname: string,
    user_email: string,
    user_username: string
};

export interface LoginUserType {
    email: string,
    unhashed_password: string
}

export class UserService {
    private _prisma: PrismaClient;

    constructor(prisma: PrismaClient)  {
        this._prisma  = prisma;
    }

    async CreateUser(_user_data: CreateUserType) {
        // Connect to database
        // _prisma.$connect();
        
        // Create password hash for user
        const _hashed_password = await getHashedPassword_async(_user_data.password);

        //TODO: Check user `email` or `username` isn't already taken.

        // Create new user in database
        const _new_user = await this._prisma.users.create({
            data: {
                user_firstname: _user_data.firstname,
                user_lastname: _user_data.lastname,
                user_email: _user_data.email,
                user_password: _hashed_password,
                user_username: _user_data.username
            }
        });

        // Create user age records in ages table.
        const _user_age = await this._prisma.ages.create({
            data: {
                user_id: _new_user.user_id,
                dob: new Date(_user_data.dob),
                age: calculateUserAge(_user_data.dob)
            }
        });

        return { status: true, data: { _new_user, _user_age }};
    };

    async ReadUser(id: number) {
        // Get the user from the database
        const _user = await this._prisma.users.findFirst({
            where: { user_id: id }
        });

        // Get the users age records from the database
        const _age = await this._prisma.ages.findFirst({
            where: { user_id: id }
        });

        // Get the users roles records from the database
        const _roles = await this._prisma.roles.findMany({
            where: { user_id: id }
        });

        return { status: true, data: { user: _user, age: _age, roles: _roles }};
    };

    async UpdateUser(_user_id: number, _user_data: UpdateUserType) {
        const _updatedUser = await this._prisma.users.update({
            where: { user_id: _user_id },
            data: _user_data
        });

        if (_updatedUser) return { status: true, data: _updatedUser };
    };

    async DeleteUser(id: number) {
        // Delete the user from the database
        const _deleted_user = await this._prisma.users.delete({
            where: { user_id: id }
        });

        //TODO: check rest of database has been cleared of the user.

        // return the deleted user record.
        return { status: true, data: _deleted_user };
    };

    PromoteUserToAdmin() {
        throw Error("not implemented yet");
    };

    DemoteUserToRegular() {
        throw Error("not implemented yet");
    };

    async TogglePrivateUser(id: number) {
        console.log(`id: ${id}`);
        const _query_find_private_user = await this._prisma.private_user.findFirst({
            where: { user_id: id }
        });

        console.log(`query: ${_query_find_private_user}`);
        
        if (_query_find_private_user == null || _query_find_private_user == undefined) {
            const _private_user_record = await this._prisma.private_user.create({
                data: { user_id: id }
            });

            return { status: true, data: _private_user_record };
        } else {
            const _delete_private_user_record = await this._prisma.private_user.delete({
                where: { id: _query_find_private_user.id }
            });

            return { status: false, data: _delete_private_user_record };
        }

        return { status: false, data: { message: "[ERR] Failed to privitize user...?"}};
    };

    async Login(login_data: LoginUserType) {
        const user = await this._prisma.users.findFirst({
            where: { user_email: login_data.email }
        });

        // Check that the user exists
        if (user == undefined || user == null) {
            return { status: false, data: { message: "FAILED TOP FIND USER" }};
        }

        // Check the password using a salt
        const check = await checkPassword(login_data.unhashed_password, user.user_password);

        // Compare the check on the password
        if (!check) {
            return { status:false, data: { message: "PASSWORD WAS INCORRECT"}};
        }

        // Create a JWT access token for the user
        const accessToken = generateAccessToken({ email: login_data.email });

        return {status: check, data: { success: check, user: user, token: accessToken }};
    }

};