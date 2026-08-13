import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';
export class AddInvoices1787270400000 implements MigrationInterface {
  async up(q: QueryRunner) {
    await q.query(`CREATE SEQUENCE "invoice_number_seq" START WITH 1 INCREMENT BY 1`);
    const money = (name:string, defaultValue?:number) => ({name,type:'decimal',precision:12,scale:2,default:defaultValue});
    await q.createTable(new Table({name:'invoices',columns:[
      {name:'id',type:'uuid',isPrimary:true,generationStrategy:'uuid',default:'uuid_generate_v4()'},{name:'created_at',type:'timestamp',default:'now()'},{name:'updated_at',type:'timestamp',default:'now()'},{name:'deleted_at',type:'timestamp',isNullable:true},
      {name:'invoiceNumber',type:'varchar',length:'30'},{name:'orderId',type:'uuid'},{name:'customerId',type:'uuid'},{name:'status',type:'varchar',length:'20',default:"'issued'"},{name:'issuedAt',type:'timestamp'},{name:'currencyCode',type:'varchar',length:'3'},
      money('subtotal'),money('couponDiscount',0),money('pointsDiscount',0),money('cashbackUsed',0),money('shippingAmount',0),money('taxAmount',0),money('totalAmount'),money('paidAmount'),money('refundedAmount',0),
      {name:'customerSnapshot',type:'jsonb'},{name:'billingAddressSnapshot',type:'jsonb',isNullable:true},{name:'shippingAddressSnapshot',type:'jsonb',isNullable:true},{name:'storeSnapshot',type:'jsonb'},{name:'paymentSnapshot',type:'jsonb'},
    ],foreignKeys:[{columnNames:['orderId'],referencedTableName:'orders',referencedColumnNames:['id'],onDelete:'RESTRICT'},{columnNames:['customerId'],referencedTableName:'customers',referencedColumnNames:['id'],onDelete:'RESTRICT'}]}));
    await q.createIndex('invoices',new TableIndex({name:'UQ_invoice_number',columnNames:['invoiceNumber'],isUnique:true}));
    await q.createIndex('invoices',new TableIndex({name:'UQ_invoice_order',columnNames:['orderId'],isUnique:true}));
    await q.createIndex('invoices',new TableIndex({name:'IDX_invoice_customer_issued',columnNames:['customerId','issuedAt']}));
    await q.createTable(new Table({name:'invoice_items',columns:[{name:'id',type:'uuid',isPrimary:true,generationStrategy:'uuid',default:'uuid_generate_v4()'},{name:'created_at',type:'timestamp',default:'now()'},{name:'updated_at',type:'timestamp',default:'now()'},{name:'deleted_at',type:'timestamp',isNullable:true},{name:'invoiceId',type:'uuid'},{name:'productId',type:'uuid',isNullable:true},{name:'productName',type:'varchar',length:'500'},{name:'variantId',type:'uuid',isNullable:true},{name:'variantSku',type:'varchar',length:'100',isNullable:true},{name:'variantDescription',type:'varchar',length:'1000',isNullable:true},{name:'quantity',type:'integer'},money('unitPrice'),money('lineTotal')],foreignKeys:[{columnNames:['invoiceId'],referencedTableName:'invoices',referencedColumnNames:['id'],onDelete:'RESTRICT'}],checks:[{name:'CHK_invoice_item_quantity',expression:'"quantity" > 0'}]}));
  }
  async down(q: QueryRunner) { await q.dropTable('invoice_items'); await q.dropTable('invoices'); await q.query(`DROP SEQUENCE "invoice_number_seq"`); }
}
