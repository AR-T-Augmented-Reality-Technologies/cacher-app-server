import { PrismaClient } from "@prisma/client";
import { getHashedPassword_async, checkPassword, generateAccessToken }  from "../middleware/users.middleware";
import { calculateUserAge } from "../helpers/users.helper";

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
    user_username: string,
    user_password: string,
    user_password_confirm: string,
    user_dob: string
};

export interface LoginUserType {
    email: string,
    unhashed_password: string
}
/**

 * @class UserService
 * @description This class is used to handle all user related database queries.
 * @param {PrismaClient} prisma - The prisma client object.
 * @returns {UserService} - The UserService object.
 * @example
 * const userService = new UserService(prisma);
 * @example
 * const userService = new UserService(new PrismaClient());
 * @example
 * const userService = new UserService();
 */
export class UserService {
    private _prisma: PrismaClient;

    constructor(prisma: PrismaClient)  {
        this._prisma  = prisma;
    }

    /**
     * @method CreateUser
     * @description This method is used to create a new user in the database.
     * @param {CreateUserType} _user_data - The user data to create a new user.
     * @returns {Promise<{ status: boolean, data: { message: string } }>} - The response object.
     * @example
     * const userService = new UserService(prisma);
     * const response = await userService.CreateUser({
     * 
     * });
     */
    async CreateUser(_user_data: CreateUserType) {
        // Connect to database
        // _prisma.$connect();
        
        // Hash the password
        const _hashed_password = await getHashedPassword_async(_user_data.password);

        // Check if email is already in the users table
        const _emailTaken = await this._prisma.users.findFirst({
            where: { user_email: _user_data.email }
        });

        if (_emailTaken) {
            return { status: false, data: { message: "EMAIL ALREADY EXISTS" }};
        }

        const _usernameTaken = await this._prisma.users.findFirst({
            where: { user_username: _user_data.username }
        });

        if (_usernameTaken) {
            return { status: false, data: { message: "USERNAME ALREADY EXISTS" }};
        }

        const _age = calculateUserAge(_user_data.dob);
        
        if (_age < 13) {
            return { status: false, data: { message: "USER IS UNDER 13" }};
        }

        // Check if year of birth is valid
        if (_user_data.dob[0] != "1" && _user_data.dob[0] != "2") {
            // Invalid year of birth
            return { status: false, data: { message: "INVALID YEAR OF BIRTH" }};
        }

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

        const _user_roles = await this._prisma.roles.create({
            data: {
                users: {
                    connect: {
                        user_id: _new_user.user_id,
                    }
                },
                roles_name: "user",
                roles_description: "User",
                roles_serialized: ""
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
        const _currentUser = await this._prisma.users.findUnique({
          where: { user_id: _user_id }
        });
      
        if (!_currentUser) {
          return { status: false, data: { message: "USER NOT FOUND" }};
        }

        const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
      
        if (_user_data.user_email && _user_data.user_email !== _currentUser.user_email) {
          const _emailTaken = await this._prisma.users.findFirst({
            where: { user_email: _user_data.user_email }
          });
      
          if (_emailTaken) {
            return { status: false, data: { message: "EMAIL ALREADY EXISTS" }};
          }
        }
        
        if (_user_data.user_email && !regex_email.test(_user_data.user_email)) {
            return { status: false, data: { message: "INVALID EMAIL FORMAT" }};
        }

        if (_user_data.user_dob == null) {
            return { status: false, data: { message: "DATE OF BIRTH CANNOT BE EMPTY" }};
        }

        if (_user_data.user_email === "") {
            return { status: false, data: { message: "EMAIL CANNOT BE EMPTY" }};
        }

        if (_user_data.user_firstname === "") {
            return { status: false, data: { message: "FIRST NAME CANNOT BE EMPTY" }};
        }

        if (_user_data.user_lastname === "") {
            return { status: false, data: { message: "LAST NAME CANNOT BE EMPTY" }};
        }
      
        if (_user_data.user_username && _user_data.user_username !== _currentUser.user_username) {
          const _usernameTaken = await this._prisma.users.findFirst({
            where: { user_username: _user_data.user_username }
          });
      
          if (_usernameTaken) {
            return { status: false, data: { message: "USERNAME ALREADY EXISTS" }};
          }
        }

        if (_user_data.user_username === "") {
            return { status: false, data: { message: "USERNAME CANNOT BE EMPTY" }};
        }

        if (calculateUserAge(_user_data.user_dob) < 13) {
            return { status: false, data: { message: "USER IS UNDER 13" }};
        }

        if (_user_data.user_dob[0] != "1" && _user_data.user_dob[0] != "2") {
            return { status: false, data: { message: "INVALID YEAR OF BIRTH" }};
        }
      
        const data: any = {
          user_firstname: _user_data.user_firstname ?? _currentUser.user_firstname,
          user_lastname: _user_data.user_lastname ?? _currentUser.user_lastname,
          user_email: _user_data.user_email ?? _currentUser.user_email,
          user_username: _user_data.user_username ?? _currentUser.user_username
        };
          
          if (!_user_data.user_password) {
            // Password field is empty, skip all checks
          } else if (_user_data.user_password !== _currentUser.user_password && _user_data.user_password === _user_data.user_password_confirm) {
            data.user_password = await getHashedPassword_async(_user_data.user_password);
          } 
          else if (_user_data.user_password !== _currentUser.user_password) {
            // Passwords don't match and confirmation doesn't match, return error
            return { status: false, data: { message: "PASSWORDS DONT MATCH" }};
          }
          
        const _updatedUser = await this._prisma.users.update({
          where: { user_id: _user_id },
          data
        });
      
        if (_updatedUser) {
          const _updatedAge = await this._prisma.ages.update({
            where: { id: _user_id },
            data: {
                dob: new Date(_user_data.user_dob),
                age: calculateUserAge(_user_data.user_dob)
            }
          });
      
          return { status: true, data: _updatedUser };
        }
      
        return { status: false, data: { message: "USER UPDATE FAILED" }};
      }
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
            return { status: false, data: { message: "FAILED TO FIND USER" }};
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

    async UpdateProfilePicture(id: number, imageURL: string) {
        console.log("Updating profile picture for user: " + id + " to:" + imageURL)
        const _user = await this._prisma.users.findFirst({
            where: { user_id: id }
        });

        if (_user == null || _user == undefined) {
            return { status: false, data: { message: "FAILED TO FIND USER" }};
        }

        const _updatedUser = await this._prisma.users.update({
            where: { user_id: id },
            data: { 
                profile_pic: imageURL 
            }
        });

        return { status: true, data: _updatedUser };
    }

};