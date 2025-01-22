import Writer from '../models/Writer.js'
import bcrypt from 'bcryptjs';
import { request, response } from 'express';
import jwt from 'jsonwebtoken'
import validator from 'validator';

const createToken = (_id) => {

    const jwtKey = 'SECRETKEY';

    return jwt.sign({_id}, jwtKey, { expiresIn: "3d", algorithm: 'HS256' });

}

// Middleware for verifying the token
export const verifyToken = (request, response, next) => {
    try {
        const token = request.headers.authorization?.split(' ')[1]; // Extract Bearer token
        
        if (!token) {
            return response.status(401).json({ msg: 'Unauthorized, token is missing' });
        }

        const jwtKey = 'SECRETKEY';
        const decoded = jwt.verify(token, jwtKey); // Verify token validity

        request.user = decoded; // Attach decoded payload (e.g., _id) to req
        next(); // Pass control to the next middleware or controller
    } 
    
    catch (error) {
        return response.status(403).json({ msg: 'Invalid or expired token', error: error.message });
    }
};

//  ---   API ENDPOINTS ---
//register writer/user
const createAccount = async (request, response) => {
    try {
        const { name, email, password } = request.body;

        // Check if user already exists
        const existingUser = await Writer.findOne({ email });

        if (!name || !email || !password) {
            return response.status(400).json({error: "All fields are required!"})
        }

        if (existingUser) {
            return response.status(400).json({ message: 'User already exists' });
        }

        if(!validator.isEmail(email)){
            return response.status(400).json({error: "Email is not valid"});
        }

        if(!validator.isStrongPassword(password)){
            return response.status(400).json({error: "Please create a stronger password - at least one lowercase, uppercase, number, symbol, and up to 8 characters in total"});
        }
        console.log(name, email, password)


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const writer = new Writer({
            name,
            email,
            password: hashedPassword,
            profileImage: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name),
            bookmarkedArticles: [],
        });


        await writer.save();

        const token = createToken(writer._id);

        // response.status(201).json({ message: 'Account created successfully', author });
        response.status(201).json({ msg: 'account created successfuly', _id: writer._id, writer, token});


    } catch (error) {
        response.status(500).json({ message: error.message });
    }
};


//login user/writer
const login = async (request, response) => {
    try {
        const { email, password } = request.body;

        const writer = await Writer.findOne({ email });

        if (!writer) {
            return response.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, writer.password);

        if (!isMatch) {
            return response.status(400).json({ message: 'Erm.. you may have to recheck your credentials' });
        }

        // const token = jwt.sign({ id: writer._id }, 'your_jwt_secret', { expiresIn: '1h' });
        const token = createToken(writer._id);

        response.status(200).json({ message: 'Login successful', writer: writer, token });

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
};

//find user
const findWriter = async (request, response) => {
    const writerId = request.params.id;

    if (!writerId || writerId === 'undefined') {
        console.log('Received an invalid writerId:', writerId);
        return response.status(400).json({ error: 'Invalid userId' });
    }

    try {
        const writer = await Writer.findById(writerId);

        if (!writer) {
            return response.status(404).json({ error: 'User not found' });
        }

        response.status(200).json(writer);

    } catch (error) {
        console.log('Error in findWriter:', error);
        response.status(500).json({ error: 'Server error' });
    }
}

//get all users
const getWriters = async (request, response) => {
    try {
        const writers = await Writer.find();

        response.status(200).json(writers)

    } catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
}

//logout
const logout = (request, response) => {

    request.logout((error) => {
        if (error) {
            return response.status(500).json({msg: 'we encountered a problem logging you out', error: error});
        }

        request.session.destroy((destroyError) => {
            if (destroyError) {
                return response.status(500).json({msg: 'session destr failed', error: destroyError});
            }

            response.status(200).json({msg: 'logged out successfully'});
        });
    })
}

export default { createAccount, login, logout, findWriter, getWriters};


//find writer/user


//get user/writer