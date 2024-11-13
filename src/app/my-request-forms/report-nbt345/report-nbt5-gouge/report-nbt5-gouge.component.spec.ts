import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportNbt5GougeComponent } from './report-nbt5-gouge.component';

describe('ReportNbt5GougeComponent', () => {
  let component: ReportNbt5GougeComponent;
  let fixture: ComponentFixture<ReportNbt5GougeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportNbt5GougeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportNbt5GougeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
