// post.model.ts
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/localSequelize.js';

export const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});