export type CustomerType = {
  created_at: string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  username: string;
};
export type CrmCustomer=CustomerType&{phone:string|null;createdAt:string;crmStatus:string;segment:string;totalOrders:number;completedOrders:number;totalSpent:number;averageOrderValue:number;firstOrderAt:string|null;lastOrderAt:string|null;pointsBalance:number;cashbackBalance:number;wishlistCount:number;approvedReviews:number;pendingReviews:number;hasAbandonedCart:boolean;hasNotes:boolean;tags:{id:string;name:string}[]};export type CrmDetail=CrmCustomer&{orders:any[];rewardActivity:any[];reviews:any[];carts:any[];invoices:any[];notes:CrmNote[];cancelledOrders:number;refundedOrders:number};export type CrmNote={id:string;note:string;createdAt:string;updatedAt:string;adminUserId:string;adminName:string};export type CustomerTag={id:string;name:string};
