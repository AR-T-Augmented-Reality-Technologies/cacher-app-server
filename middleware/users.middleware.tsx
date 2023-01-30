// Users middleware methods
import bcrypt from 'bcrypt';

const getHashedPassword = (unhashed_password: string) => {
    const hashed_password = bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.error(err);
            return "";
        }

        bcrypt.hash(unhashed_password, salt, (err, encrypted) => {
            if (err) {
                console.error(err);
                return "";
            }

            // console.log(encrypted);
            return encrypted;
        });
    }); 

    return hashed_password;
};

const getHashedPassword_async = async function (unhashed_password: string) {
    // Generate salt
    const salt = await bcrypt.genSalt(10);

    const hashed_password = await bcrypt.hash(unhashed_password, salt);

    return hashed_password;
};

const checkPassword = (unhashed_password: string, hashed_password: string) => {
    bcrypt.compare(unhashed_password, hashed_password, (err, same) => {
        if (err) {
            console.error(err);
            return false;
        }

        console.log(`Password check: ${same}`);
        return same;
    });
};

export { getHashedPassword, getHashedPassword_async };