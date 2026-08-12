import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';
export class AddLoyaltyRewards1786579200000 implements MigrationInterface {
  private base = [
    { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid' as const, default: 'uuid_generate_v4()' },
    { name: 'created_at', type: 'timestamp', default: 'now()' }, { name: 'updated_at', type: 'timestamp', default: 'now()' },
    { name: 'deleted_at', type: 'timestamp', isNullable: true },
  ];
  async up(q: QueryRunner) {
    if (!(await q.hasTable('loyalty_settings'))) await q.createTable(new Table({ name: 'loyalty_settings', columns: [...this.base,
      { name: 'pointsEnabled', type: 'boolean', default: false }, { name: 'pointsPerCurrencyUnit', type: 'decimal', precision: 12, scale: 4, default: 0 },
      { name: 'pointsPerCurrencyRedemptionUnit', type: 'decimal', precision: 12, scale: 4, default: 100 }, { name: 'minimumPointsToRedeem', type: 'integer', default: 0 },
      { name: 'maximumPointsRedemptionPercent', type: 'decimal', precision: 5, scale: 2, default: 0 }, { name: 'pointsExpirationDays', type: 'integer', isNullable: true },
      { name: 'cashbackEnabled', type: 'boolean', default: false }, { name: 'cashbackPercent', type: 'decimal', precision: 5, scale: 2, default: 0 },
      { name: 'cashbackMinimumOrderAmount', type: 'decimal', precision: 12, scale: 2, default: 0 }, { name: 'cashbackMaximumPerOrder', type: 'decimal', precision: 12, scale: 2, isNullable: true },
      { name: 'cashbackExpirationDays', type: 'integer', isNullable: true }, { name: 'maximumCashbackUsePercent', type: 'decimal', precision: 5, scale: 2, default: 0 },
      { name: 'rewardsGrantedOn', type: 'varchar', default: "'COMPLETED'" },
    ] }));
    if (!(await q.hasTable('customer_reward_accounts'))) {
      await q.createTable(new Table({ name: 'customer_reward_accounts', columns: [...this.base, { name: 'customerId', type: 'uuid' }, { name: 'pointsBalance', type: 'integer', default: 0 }, { name: 'cashbackBalance', type: 'decimal', precision: 12, scale: 2, default: 0 }] }));
      await q.createForeignKey('customer_reward_accounts', new TableForeignKey({ name: 'FK_reward_account_customer', columnNames: ['customerId'], referencedTableName: 'customers', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));
      await q.createIndex('customer_reward_accounts', new TableIndex({ name: 'UQ_reward_account_customer', columnNames: ['customerId'], isUnique: true }));
    }
    if (!(await q.hasTable('reward_transactions'))) {
      await q.createTable(new Table({ name: 'reward_transactions', columns: [...this.base, { name: 'customerId', type: 'uuid' }, { name: 'orderId', type: 'uuid', isNullable: true }, { name: 'paymentId', type: 'uuid', isNullable: true }, { name: 'type', type: 'varchar' }, { name: 'pointsAmount', type: 'integer', isNullable: true }, { name: 'cashbackAmount', type: 'decimal', precision: 12, scale: 2, isNullable: true }, { name: 'description', type: 'varchar', length: '500' }, { name: 'expiresAt', type: 'timestamp', isNullable: true }] }));
      await q.createForeignKeys('reward_transactions', [
        new TableForeignKey({ name: 'FK_reward_transaction_customer', columnNames: ['customerId'], referencedTableName: 'customers', referencedColumnNames: ['id'], onDelete: 'CASCADE' }),
        new TableForeignKey({ name: 'FK_reward_transaction_order', columnNames: ['orderId'], referencedTableName: 'orders', referencedColumnNames: ['id'], onDelete: 'SET NULL' }),
        new TableForeignKey({ name: 'FK_reward_transaction_payment', columnNames: ['paymentId'], referencedTableName: 'payments', referencedColumnNames: ['id'], onDelete: 'SET NULL' }),
      ]);
      await q.createIndex('reward_transactions', new TableIndex({ name: 'UQ_reward_transaction_order_type', columnNames: ['orderId', 'type'], isUnique: true, where: '"orderId" IS NOT NULL' }));
      await q.createIndex('reward_transactions', new TableIndex({ name: 'IDX_reward_transaction_customer_created', columnNames: ['customerId', 'created_at'] }));
    }
    for (const c of [
      new TableColumn({ name: 'pointsRedeemed', type: 'integer', default: 0 }), new TableColumn({ name: 'pointsDiscountAmount', type: 'decimal', precision: 12, scale: 2, default: 0 }),
      new TableColumn({ name: 'cashbackUsed', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    ]) if (!(await q.hasColumn('orders', c.name))) await q.addColumn('orders', c);
  }
  async down(q: QueryRunner) {
    for (const c of ['cashbackUsed', 'pointsDiscountAmount', 'pointsRedeemed']) if (await q.hasColumn('orders', c)) await q.dropColumn('orders', c);
    if (await q.hasTable('reward_transactions')) await q.dropTable('reward_transactions');
    if (await q.hasTable('customer_reward_accounts')) await q.dropTable('customer_reward_accounts');
    if (await q.hasTable('loyalty_settings')) await q.dropTable('loyalty_settings');
  }
}
