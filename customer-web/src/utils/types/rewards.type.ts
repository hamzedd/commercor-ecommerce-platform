export type RewardTransaction={id:string;type:string;pointsAmount:number|null;cashbackAmount:number|null;description:string;expiresAt:string|null;created_at:string};
export type RewardsSummary={pointsBalance:number;cashbackBalance:number;pointsEnabled:boolean;cashbackEnabled:boolean;recentTransactions:RewardTransaction[]};
