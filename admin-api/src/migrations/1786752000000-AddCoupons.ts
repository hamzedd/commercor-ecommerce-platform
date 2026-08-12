import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';
export class AddCoupons1786752000000 implements MigrationInterface {
  async up(q: QueryRunner) {
    await q.createTable(new Table({ name:'coupons', columns:[
      {name:'id',type:'uuid',isPrimary:true,generationStrategy:'uuid',default:'uuid_generate_v4()'}, {name:'created_at',type:'timestamp',default:'now()'}, {name:'updated_at',type:'timestamp',default:'now()'}, {name:'deleted_at',type:'timestamp',isNullable:true},
      {name:'code',type:'varchar',length:'100'}, {name:'name',type:'varchar',length:'200'}, {name:'description',type:'text',isNullable:true}, {name:'type',type:'varchar',length:'20'}, {name:'value',type:'decimal',precision:12,scale:2}, {name:'enabled',type:'boolean',default:true},
      {name:'startsAt',type:'timestamp',isNullable:true}, {name:'expiresAt',type:'timestamp',isNullable:true}, {name:'minimumOrderAmount',type:'decimal',precision:12,scale:2,isNullable:true}, {name:'maximumDiscountAmount',type:'decimal',precision:12,scale:2,isNullable:true}, {name:'usageLimit',type:'integer',isNullable:true}, {name:'usageLimitPerCustomer',type:'integer',isNullable:true}, {name:'totalUsageCount',type:'integer',default:0},
    ], checks:[
      {name:'CHK_coupon_value',expression:`("type" = 'percentage' AND "value" > 0 AND "value" <= 100) OR ("type" = 'fixed' AND "value" > 0)`},
      {name:'CHK_coupon_max_discount',expression:'"maximumDiscountAmount" IS NULL OR "maximumDiscountAmount" >= 0'},
      {name:'CHK_coupon_limits',expression:'("usageLimit" IS NULL OR "usageLimit" > 0) AND ("usageLimitPerCustomer" IS NULL OR "usageLimitPerCustomer" > 0)'},
      {name:'CHK_coupon_dates',expression:'"startsAt" IS NULL OR "expiresAt" IS NULL OR "startsAt" < "expiresAt"'},
    ]}));
    await q.createIndex('coupons',new TableIndex({name:'UQ_coupons_code_normalized',columnNames:['code'],isUnique:true}));
    for(const c of [new TableColumn({name:'couponId',type:'uuid',isNullable:true}),new TableColumn({name:'couponCode',type:'varchar',length:'100',isNullable:true}),new TableColumn({name:'couponDiscountAmount',type:'decimal',precision:12,scale:2,default:0})]) await q.addColumn('orders',c);
    await q.createForeignKey('orders',new TableForeignKey({name:'FK_orders_coupon',columnNames:['couponId'],referencedTableName:'coupons',referencedColumnNames:['id'],onDelete:'RESTRICT'}));
    await q.createIndex('orders',new TableIndex({name:'IDX_orders_coupon_status',columnNames:['couponId','status']}));
    await q.createTable(new Table({name:'coupon_usages',columns:[{name:'id',type:'uuid',isPrimary:true,generationStrategy:'uuid',default:'uuid_generate_v4()'},{name:'created_at',type:'timestamp',default:'now()'},{name:'updated_at',type:'timestamp',default:'now()'},{name:'deleted_at',type:'timestamp',isNullable:true},{name:'couponId',type:'uuid'},{name:'customerId',type:'uuid'},{name:'orderId',type:'uuid'},{name:'discountAmount',type:'decimal',precision:12,scale:2}]}));
    await q.createForeignKeys('coupon_usages',[
      new TableForeignKey({name:'FK_coupon_usage_coupon',columnNames:['couponId'],referencedTableName:'coupons',referencedColumnNames:['id'],onDelete:'RESTRICT'}),new TableForeignKey({name:'FK_coupon_usage_customer',columnNames:['customerId'],referencedTableName:'customers',referencedColumnNames:['id'],onDelete:'RESTRICT'}),new TableForeignKey({name:'FK_coupon_usage_order',columnNames:['orderId'],referencedTableName:'orders',referencedColumnNames:['id'],onDelete:'RESTRICT'})]);
    await q.createIndex('coupon_usages',new TableIndex({name:'UQ_coupon_usage_order',columnNames:['orderId'],isUnique:true})); await q.createIndex('coupon_usages',new TableIndex({name:'IDX_coupon_usage_coupon_customer',columnNames:['couponId','customerId']}));
  }
  async down(q:QueryRunner){await q.dropTable('coupon_usages'); await q.dropIndex('orders','IDX_orders_coupon_status'); await q.dropForeignKey('orders','FK_orders_coupon'); for(const c of ['couponDiscountAmount','couponCode','couponId'])await q.dropColumn('orders',c); await q.dropTable('coupons');}
}
