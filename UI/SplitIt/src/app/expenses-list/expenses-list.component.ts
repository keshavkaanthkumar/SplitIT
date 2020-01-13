import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { expense } from '../expense/expense-model';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss']
})
export class ExpensesListComponent implements OnInit {
  
  @Input() expensesList: Array<expense>
  @Input() userEmail: string
  p: number = 1;
  searchText;
  @Output() deleteEvent = new EventEmitter();
  @Output() openModalWindowEvent = new EventEmitter();
  constructor() { }
  deleteExpense(expenseId) {
    this.deleteEvent.next(expenseId)
  }
  viewExpense(expense) {
    this.openModalWindowEvent.next(expense)
  }
  ngOnInit() {
  }

}
