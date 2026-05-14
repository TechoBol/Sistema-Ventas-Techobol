export interface ICashFlow {
  id?: number;
  date: string;
  account: string;
  type: "income" | "expense";
  amount: number;
  items : [];
  isUSD : boolean;
}