import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExpenseComponentComponent } from './view-expense-component.component';

describe('ViewExpenseComponentComponent', () => {
  let component: ViewExpenseComponentComponent;
  let fixture: ComponentFixture<ViewExpenseComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewExpenseComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExpenseComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
