import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportNbt4RecoveryComponent } from './report-nbt4-recovery.component';

describe('ReportNbt4RecoveryComponent', () => {
  let component: ReportNbt4RecoveryComponent;
  let fixture: ComponentFixture<ReportNbt4RecoveryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportNbt4RecoveryComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportNbt4RecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
