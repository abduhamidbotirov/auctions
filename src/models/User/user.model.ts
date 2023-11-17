import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../../db/localSequelize.js';
import { IUser } from './interface.js';

// IUser interfaceni təyin edirik
 const User = sequelize.define<Model<IUser>>(
    'user',
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlpha: true,
                len: [3, 15],
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                // isEmail: true,
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            values: ['super_admin', 'user', 'product_admin'],
            defaultValue: 'user',
        },
    },
    {
        modelName: 'User',
    }
);

export default User
