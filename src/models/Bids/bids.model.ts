import { DataTypes, Sequelize } from "sequelize"
import { sequelize } from "../../db/localSequelize.js"
const Bid = sequelize.define('bid', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
    },
    price: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
});
export default Bid  