import { Component, OnInit, Input, EventEmitter,Output } from '@angular/core';
import { settlement } from '../settle-up/settle-model';

@Component({
  selector: 'app-settlements-list',
  templateUrl: './settlements-list.component.html',
  styleUrls: ['./settlements-list.component.scss']
})
export class SettlementsListComponent implements OnInit {
  @Input() settlementsList: Array<settlement>
  @Input() userEmail: string
  p: number = 1;
  @Output() deleteEvent = new EventEmitter();
  searchText;
  constructor() { }
  deleteSettlement(settlementId) {
    this.deleteEvent.next(settlementId)
  }
  ngOnInit() {
  }

}
