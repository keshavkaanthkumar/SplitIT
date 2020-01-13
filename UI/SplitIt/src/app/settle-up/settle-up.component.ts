import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialog, MatDialogRef } from '@angular/material';
import { SettleService } from './settle.service';
import { settlement } from './settle-model'
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-settle-up',
  templateUrl: './settle-up.component.html',
  styleUrls: ['./settle-up.component.scss']
})
export class SettleUpComponent implements OnInit {
  settlement: settlement = {

    paidBy: null,
    paidTo: null,
    amount: null


  };
  allfriendsArray: string[];
  showCashPayment: Boolean = false;
  notifierServiceObj: NotifierService;
  constructor(notifierService: NotifierService, @Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<SettleUpComponent>, public settleService: SettleService) {
    this.notifierServiceObj = notifierService
    this.allfriendsArray = data.friends.map(v => v["name"]);
  }



  ngOnInit() {
  }
  showPaymentContent() {
    this.showCashPayment = true;
  }
  /**
   * Service call to add a settlement
   */
  onSettle() {
    this.settlement.paidBy = this.data.userInfo.email;
    this.settlement.paidTo = this.getEmailFromName(this.settlement.paidTo);
    this.settleService.Add(this.settlement).subscribe(() => {
      this.notifierServiceObj.notify("success", "Settled expense!");
    }, (err) => {
      console.error(err);
    });
    this.dialogRef.close();

  }
  close() {
    this.dialogRef.close();
  }
  /**
   * To get email from name
   */
  getEmailFromName(name: String): String {
    var friendName = this.data.friends.find(v => v["name"] === name);
    if (friendName != undefined) {
      return this.data.friends.find(v => v["name"] === name).email;
    } else {
      return name;
    }
  }

}
