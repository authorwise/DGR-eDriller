import {  ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AtwspreadsheetmodalComponent } from './atwspreadsheetmodal.component';

describe('AtwspreadsheetmodalComponent', () => {
  let component: AtwspreadsheetmodalComponent;
  let fixture: ComponentFixture<AtwspreadsheetmodalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AtwspreadsheetmodalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AtwspreadsheetmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
