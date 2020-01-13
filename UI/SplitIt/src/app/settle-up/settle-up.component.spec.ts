import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettleUpComponent } from './settle-up.component';

describe('SettleUpComponent', () => {
  let component: SettleUpComponent;
  let fixture: ComponentFixture<SettleUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettleUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettleUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
