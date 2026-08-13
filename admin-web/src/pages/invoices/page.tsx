import { Button, Card, Space, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { downloadInvoice, getInvoices, type Invoice } from '../../service/apiServices/invoiceServices.ts';

export default function InvoicesPage(){
  const [data,setData]=useState<Invoice[]>([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{getInvoices().then(setData).finally(()=>setLoading(false))},[]);
  const download=async(invoice:Invoice)=>{const blob=await downloadInvoice(invoice.id);const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download=`${invoice.invoiceNumber}.pdf`;anchor.click();URL.revokeObjectURL(url)};
  return <Card><Space direction="vertical" className="w-full"><Typography.Title level={2}>Invoices</Typography.Title><Table rowKey="id" loading={loading} dataSource={data} scroll={{x:800}} pagination={{pageSize:20}} columns={[
    {title:'Invoice',dataIndex:'invoiceNumber'},{title:'Customer',render:(_,row)=>row.customerSnapshot?.name||row.customerSnapshot?.email||'-'},{title:'Order',dataIndex:'orderId',render:value=>String(value).slice(0,8)},{title:'Issued',dataIndex:'issuedAt',render:value=>new Date(value).toLocaleDateString()},{title:'Total',render:(_,row)=>`${Number(row.totalAmount).toFixed(2)} ${row.currencyCode}`},{title:'Refunded',render:(_,row)=>`${Number(row.currentRefundedAmount||0).toFixed(2)} ${row.currencyCode}`},{title:'PDF',render:(_,row)=><Button onClick={()=>download(row)}>Download PDF</Button>}
  ]}/></Space></Card>;
}
