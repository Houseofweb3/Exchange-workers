import { PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert, BeforeUpdate, ValueTransformer } from "typeorm";

// Transformer to convert Date to epoch time and vice versa
export const epochTransformer: ValueTransformer = {
    to: (value: Date | number) => {
        if (typeof value === 'number') {
            return value;
        } else if (value instanceof Date) {
            return Math.floor(value.getTime() / 1000); // Convert Date to epoch seconds
        }
        throw new Error('Invalid date value');
    },
    from: (value: number) => new Date(value * 1000)  // Convert epoch seconds to Date
};

export abstract class AbstractBaseEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "created_at", type: "bigint", transformer: epochTransformer, default: () => `EXTRACT(EPOCH FROM NOW())` })
    createdAt!: number;

    @Column({ name: "updated_at", type: "bigint", transformer: epochTransformer, default: () => `EXTRACT(EPOCH FROM NOW())` })
    updatedAt!: number;

    @BeforeInsert()
    setCreationDate() {
        const now = Math.floor(Date.now() / 1000);
        this.createdAt = now;
        this.updatedAt = now;
    }

    @BeforeUpdate()
    setUpdateDate() {
        this.updatedAt = Math.floor(Date.now() / 1000);
    }
}
