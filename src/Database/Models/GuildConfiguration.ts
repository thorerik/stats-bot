import {
    AutoIncrement,
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

@Table
export class GuildConfiguration extends Model<GuildConfiguration> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number;

    @Unique
    @Column
    public guildID: string;

    @Default(JSON.stringify({prefix: "!"}))
    @Column
    public settings: string;

    @CreatedAt
    public createdAt;

    @UpdatedAt
    public updatedAt;

}
