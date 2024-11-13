import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportNBT11T2AndNBT345NB1Page } from './report-nbt11-t2-and-nbt345-nb1.page';

describe('ReportNBT11T2AndNBT345NB1Page', () => {
  let component: ReportNBT11T2AndNBT345NB1Page;
  let fixture: ComponentFixture<ReportNBT11T2AndNBT345NB1Page>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportNBT11T2AndNBT345NB1Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportNBT11T2AndNBT345NB1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
