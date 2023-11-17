import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../../db/localSequelize.js";

const Auction = sequelize.define('auction', {
    id: {
        type: DataTypes.UUID, // Assuming the ID is a UUID, adjust the data type if needed
        defaultValue: Sequelize.literal("gen_random_uuid()"), // Generate a UUID as the default value
        primaryKey: true, // Make it the primary key
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    start_price: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    dueto: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
});
export default Auction