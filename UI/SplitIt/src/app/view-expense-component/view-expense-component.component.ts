import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-view-expense-component',
  templateUrl: './view-expense-component.component.html',
  styleUrls: ['./view-expense-component.component.scss']
})
export class ViewExpenseComponentComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public epenseDetails: any) {
    console.log(epenseDetails)
  }

  ngOnInit() {
  }

}
