import {Column,Entity} from 'typeorm';import {BaseEntity} from '../BaseEntity';
export enum PromotionType{ORDER='order_discount',PRODUCT='product_discount',CATEGORY='category_discount',BOGO='buy_x_get_y',FREE_SHIPPING='free_shipping'}
export enum PromotionDiscountType{PERCENTAGE='percentage',FIXED='fixed'}
export enum PromotionStatus{DRAFT='draft',ACTIVE='active',DISABLED='disabled'}
@Entity('promotions') export class PromotionEntity extends BaseEntity{
 @Column({length:200})name:string;@Column({type:'text',nullable:true})internalDescription:string|null;
 @Column({type:'varchar',length:30})type:PromotionType;@Column({type:'varchar',length:20})discountType:PromotionDiscountType;@Column({type:'decimal',precision:12,scale:2,default:0})discountValue:number;
 @Column({type:'varchar',length:20,default:'draft'})status:PromotionStatus;@Column({type:'integer',default:0})priority:number;@Column({default:false})stackable:boolean;
 @Column({type:'timestamp',nullable:true})startsAt:Date|null;@Column({type:'timestamp',nullable:true})endsAt:Date|null;@Column({type:'decimal',precision:12,scale:2,nullable:true})minimumSubtotal:number|null;@Column({type:'decimal',precision:12,scale:2,nullable:true})maximumDiscount:number|null;
 @Column({type:'integer',nullable:true})usageLimit:number|null;@Column({type:'integer',nullable:true})usagePerCustomer:number|null;@Column({default:true})automatic:boolean;@Column({type:'varchar',length:100,nullable:true})code:string|null;
 @Column({type:'integer',nullable:true})buyQuantity:number|null;@Column({type:'integer',nullable:true})getQuantity:number|null;@Column({type:'decimal',precision:5,scale:2,nullable:true})getDiscountPercent:number|null;
}
