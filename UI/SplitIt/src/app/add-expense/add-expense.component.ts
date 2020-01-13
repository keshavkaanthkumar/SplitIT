import { Component, OnInit, Inject, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { expense } from '../expense/expense-model';
import { MatDialogRef, MatDialogTitle, MatDialogConfig, MatDialog, MatFormFieldModule, MatInputModule, MatChipsModule, MatIconModule, MAT_DIALOG_DATA, MatSelectModule, MatOptionModule, MatExpansionModule, MatDialogModule, MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { split } from '../expense/expense-split';
import { splitAtColon } from '@angular/compiler/src/util';
import { ExpenseService } from '../expense/expense.service';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NotifierService } from 'angular-notifier';
export interface Email {
  name: String;
  email: String;
  split: any
}
@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
/**
 * Add expense component to allow the users to add the expense and split information
 */
export class AddExpenseComponent implements OnInit {
  TotalAmount: any;
  splitstatus = 'equally';
  visible = true;
  selectable = true;

  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: Email[] = [

  ];
  friendCtrl = new FormControl();
  filteredFriends: Observable<string[]>;

  @ViewChild('friendInput', { static: false }) friendInput: ElementRef<HTMLInputElement>;

  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  allfriendsArray: string[];
  private readonly notifier: NotifierService;

  constructor(notifierService: NotifierService, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public dialogRef: MatDialogRef<AddExpenseComponent>, public expenseService: ExpenseService) {
    this.notifier = notifierService;
    this.allfriendsArray = data.friends.map(v => v["name"]);
    this.filteredFriends = this.friendCtrl.valueChanges.pipe(
      startWith(null),
      map((friend: string | null) => friend ? this._filter(friend) : this.allfriendsArray.slice()));
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allfriendsArray.filter(friend => friend.toLowerCase().indexOf(filterValue) === 0);
  }
  ngOnInit() {
    this.emails.push({ name: "you", email: this.data.userInfo.email, split: null })
  }
  /**
   * 
   * @param event Will add the entered email/name to the list
   */
  add(event: MatChipInputEvent): void {
    console.log(event)
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;


      if ((value || '').trim()) {
        this.emails.push({ name: value.trim(), email: this.getEmailFromName(value.trim()), split: null });
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
      this.friendCtrl.setValue(null);
    }

  }
  /**
   * To get name from email id
   * @param name Name of the person
   */
  getEmailFromName(name: String): String {
    var friendName = this.data.friends.find(v => v["name"] === name);
    if (friendName != undefined) {
      return this.data.friends.find(v => v["name"] === name).email;
    } else {
      return name;
    }
  }


  selected(event: MatAutocompleteSelectedEvent): void {
    this.emails.push({ name: event.option.viewValue, email: this.getEmailFromName(event.option.viewValue), split: null });
    this.friendInput.nativeElement.value = '';
    this.friendCtrl.setValue(null);
  }
  /**
   * To remove an email from list
   * @param email 
   */
  remove(email: Email): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }
  // expense: expense;
  expense: expense = {
    addedBy: null,
    addedByName: null,
    title: null,
    amount: null,
    currency: null,
    date: null,
    paidBy: null,
    paidByName: null,
    split: new Array()


  };


  onAdd() {
    this.TotalAmount = 0;
    /**
     * If the expense is paid by the user
     */
    if (this.expense.paidBy === "you") {
      this.expense.paidBy = this.data.userInfo.email;
      this.expense.paidByName = this.data.userInfo.email;

    }
    else {
      this.expense.paidByName = this.expense.paidBy;
      this.expense.paidBy = this.getEmailFromName(this.expense.paidByName)
    }

    this.expense.addedBy = this.data.userInfo.email;
    this.expense.addedByName = this.data.userInfo.name;


    this.expense.currency = "$";
    this.expense.date = Date.now().toString();
    /**
     * If the expense is paid equally
     */
    if (this.splitstatus === 'equally') {
      this.emails.forEach(email => {
        if (email.name === 'you') {
          this.expense.split.push({ owes: this.expense.amount / (this.emails.length), userEmail: this.data.userInfo.email, userName: this.data.userInfo.email });

        }
        else {
          this.expense.split.push({ owes: this.expense.amount / (this.emails.length), userEmail: email.email, userName: email.name });

        }
        // this.expense.split[i].owes=this.expense.amount.valueOf()/this.emails.length;
      })
      this.TotalAmount = this.expense.amount;
    }
    /**
     * If the expense is paid unequally
     */
    else {
      this.emails.forEach(email => {
        if (email.name === 'you') {
          this.expense.split.push({ owes: email.split, userEmail: this.data.userInfo.email, userName: this.data.userInfo.name });

        }
        else {
          this.expense.split.push({ owes: email.split, userEmail: email.email, userName: email.name });

        }
        this.TotalAmount = Number.parseInt(this.TotalAmount) + Number.parseInt(email.split);
        // this.expense.split[i].owes=this.expense.amount.valueOf()/this.emails.length;
      })
    }
    if (this.TotalAmount == this.expense.amount) {
      this.expenseService.Add(this.expense).subscribe(() => {
        console.log("notificatin")
        this.notifier.notify("success", "New Expense added!");
      }, (err) => {
        console.error(err);
      });
      //this.expense.split.push({owes:200,userEmail:"kkk@gmail.com",userName:"kkk"});
      this.dialogRef.close();
    }
    else {
      alert("The total of everyone's owed share (" + this.TotalAmount + ") is diffrent to the actual amount: " + this.expense.amount);
    }
  }

  close() {
    this.dialogRef.close();
  }

}
