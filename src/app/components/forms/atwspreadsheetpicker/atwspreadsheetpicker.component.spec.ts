import {  ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AtwspreadsheetpickerComponent } from './atwspreadsheetpicker.component';

describe('AtwspreadsheetpickerComponent', () => {
  let component: AtwspreadsheetpickerComponent;
  let fixture: ComponentFixture<AtwspreadsheetpickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AtwspreadsheetpickerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AtwspreadsheetpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
