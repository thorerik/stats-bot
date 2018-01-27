import {
    Column,
    CreatedAt,
    Default,
    HasMany,
    Model,
    PrimaryKey,
    Table,
    Unique,
    UpdatedAt,
} from "sequelize-typescript";
import { Sequelize } from "sequelize-typescript/lib/models/Sequelize";

@Table
export class Stats extends Model<Stats> {

    @PrimaryKey
    @Default(Sequelize.UUIDV4)
    @Column(Sequelize.UUID)
    public uuid: number;

    @Column
    public guildID: string;

    @Column
    public userId: string;

    @Column
    public count: number;

    @CreatedAt
    public createdAt;

    @UpdatedAt
    public updatedAt;

}
