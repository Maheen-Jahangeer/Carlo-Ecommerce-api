import moongose from 'mongoose'

export const User = new moongose.Schema(
    {
        name: {
            type: String,
            min: 3,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            require: true,
        },
        password: {
            type: String,
            min: 6,
        },
        isAdmin:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps: true,
    }
)

export default moongose.model('User', User)
