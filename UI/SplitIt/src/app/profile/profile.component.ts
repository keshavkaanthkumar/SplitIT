import { Component } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { DatePipe } from '@angular/common';
import { AddExpenseComponent } from '../add-expense/add-expense.component'
import { MatDialog } from '@angular/material'
import { SettleUpComponent } from '../settle-up/settle-up.component';
import { ExpenseService } from '../expense/expense.service';
import { Router, ActivatedRoute } from '@angular/router';
import { settlement } from '../settle-up/settle-model';
import { ViewExpenseComponentComponent } from '../view-expense-component/view-expense-component.component';
import { NotifierService } from 'angular-notifier';
import { SettleService } from '../settle-up/settle.service';


@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent {
  details: any = {
    userInfo: {},
    friends: [],
    expenses: [],
    settlementsIncoming: [],
    settlementsOutgoing: [],
    trends: {
      totalBalance: 0,
      totalShare: 0,
      paymentsMade: 0,
      totalChangeInBalance: 0
    },
    dashboard: {
      totalBalance: 0,
      owe: {
        amount: 0,
        oweToUsers: []
      },
      get: {
        amount: 0,
        getFromUsers: []
      }
    }
  }
  settlements: any;
  notifierService: NotifierService;
  constructor(notifierService: NotifierService,public settlementService: SettleService, private auth: AuthenticationService, public expenseService: ExpenseService, public dialog: MatDialog, private route: ActivatedRoute, private router: Router) {
    this.notifierService = notifierService
  }

  ngOnInit() {
    var accessCode = this.route.snapshot.queryParamMap.get("code");
    console.log(accessCode)
    if (accessCode != null) {
      this.expenseService.ImportSplitWiseUserData(accessCode).subscribe((response) => {
        console.log(response)
        this.notifierService.notify("success", "Expense imported from SplitWise!");
        // Remove query params
        this.router.navigate([], {
          queryParams: {
            code: null,
            state: null
          },
          queryParamsHandling: 'merge'
        })
        this.loadProfile()
      })
    } else {
      this.loadProfile();
    }
  }
  deleteExpense(expenseId: string) {
    console.log(expenseId)
    this.expenseService.Delete(expenseId).subscribe((response => {
      console.log(response)
      this.notifierService.notify("success", "Deleted expense!");
      this.loadProfile();
    }))
  }
  deleteSettlement(settlementId: string) {
    console.log(settlementId)
    this.settlementService.Delete(settlementId).subscribe((response => {
      console.log(response)
      this.loadProfile();
    }))
  }
  viewExpense(epenseDetails) {
    let dialogRef = this.dialog.open(ViewExpenseComponentComponent, {
      height: '450px',
      width: '600px',
      data: epenseDetails
    });
    dialogRef.afterClosed().subscribe(() => this.ngOnInit())
  }
  /**
   * Load the profile data from the profile API
   */
  loadProfile() {

    this.auth.profile().subscribe(user => {
      const pipe = new DatePipe('en-US');
      // Use your own locale
      user.expenses.forEach(expense => {
        const myFormattedDate = pipe.transform(expense.date, 'mediumDate');
        expense.date = myFormattedDate
      });
      user.friends.forEach(friend => {
        friend.linkedExpenses.forEach(expense => {
          const myFormattedDate = pipe.transform(expense.date, 'mediumDate');
          expense.date = myFormattedDate
        })
      });
      console.log(user)
      this.details = user;
      this.settlements = [];
      this.details.settlementsIncoming.forEach(settlementIncoming => {
        const myFormattedDate = pipe.transform(settlementIncoming.date, 'mediumDate');
        settlementIncoming.date = myFormattedDate
        this.settlements.push(settlementIncoming);
      });
      this.details.settlementsOutgoing.forEach(settlementOutgoing => {
        const myFormattedDate = pipe.transform(settlementOutgoing.date, 'mediumDate');
        settlementOutgoing.date = myFormattedDate
        this.settlements.push(settlementOutgoing);
      });
    }, (err) => {
      console.error(err);
    });
  }
  /**
   * Opens the add expense modal window
   */
  addExpense() {
    let dialogRef = this.dialog.open(AddExpenseComponent, {
      height: '500px',
      width: '550px',
      data: this.details
    });
    dialogRef.afterClosed().subscribe(() => this.ngOnInit())
  }
  importExpenses() {
    this.expenseService.GetSplitWiseAuthUrl().subscribe((splitWiseAuthUrl) => {
      console.log(splitWiseAuthUrl);
      window.location.href = splitWiseAuthUrl;


    }, (err) => {
      console.error(err);
    });

  }
  settleup() {
    let dialogRef = this.dialog.open(SettleUpComponent, {
      height: '350px',
      width: '400px',
      data: this.details
    });
    dialogRef.afterClosed().subscribe(() => this.ngOnInit())
  }
}
