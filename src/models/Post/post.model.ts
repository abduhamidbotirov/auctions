// post.model.ts
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/localSequelize.js';

export const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});