import { split } from './expense-split';

export interface expense {
  addedBy: String;
  addedByName: String;
  title: String;
  amount: number;
  currency: String;
  date: String;
  paidBy: String;
  paidByName: String;
  split: split[]
}