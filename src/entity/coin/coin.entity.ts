import { Entity, PrimaryColumn, Column, Index, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity("coins")
export class Coin {
    @PrimaryColumn()
    id!: string; // Unique ID for the coin (e.g., "bitcoin")

    @Column()
    @Index()
    symbol!: string; // Symbol (e.g., "btc")

    @Column()
    name!: string; // Name (e.g., "Bitcoin")

    @Column()
    image!: string; // URL of the coin's image

    @Column({ type: "float" })
    @Index() // Index for sorting
    current_price!: number;

    @Column({ type: "bigint" })
    @Index() // Index for sorting
    market_cap!: number;

    @Column({ type: "int" })
    @Index() // Index for sorting
    market_cap_rank!: number;

    @Column({ type: "float", nullable: true })
    @Index() // Index for sorting
    fully_diluted_valuation!: number;

    @Column({ type: "float" })
    @Index() // Index for sorting
    total_volume!: number;

    @Column({ type: "float" })
    high_24h!: number;

    @Column({ type: "float" })
    low_24h!: number;

    @Column({ type: "float" })
    price_change_24h!: number;

    @Column({ type: "float" })
    price_change_percentage_24h!: number;

    @Column({ type: "float" })
    market_cap_change_24h!: number;

    @Column({ type: "float" })
    market_cap_change_percentage_24h!: number;

    @Column({ type: "float", nullable: true })
    circulating_supply!: number;

    @Column({ type: "float", nullable: true })
    total_supply!: number;

    @Column({ type: "float", nullable: true })
    max_supply!: number;

    @Column({ type: "float" })
    ath!: number;

    @Column({ type: "float" })
    ath_change_percentage!: number;

    @Column({ type: "timestamp" })
    ath_date!: Date;

    @Column({ type: "float" })
    atl!: number;

    @Column({ type: "float" })
    atl_change_percentage!: number;

    @Column({ type: "timestamp" })
    atl_date!: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @CreateDateColumn()
    createdAt?: Date;

}
