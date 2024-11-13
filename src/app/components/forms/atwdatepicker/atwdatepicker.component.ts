import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { PickerOptions, PickerColumnOption } from '@ionic/core';
import moment from 'moment-timezone';
import { IFormHookItems } from 'src/app/models/formcontrol';
const shortMonth: string[] = [
  '',
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];
const fullMonth: string[] = [
  '',
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];
@Component({
  selector: 'app-atwdatepicker',
  templateUrl: './atwdatepicker.component.html',
  styleUrls: ['./atwdatepicker.component.scss'],
})
export class AtwdatepickerComponent implements OnInit {
  @Input() properties: any;
  @Input() formId: string;
  @Input() validateForm: FormGroup;
  @Input() formHook: any;
  dayVal: number;
  monthVal: number;
  yearVal: number;
  hourVal: number;
  minuteVal: number;
  inputValBack: string;
  frmYearRange: string;
  datePickerType: string;
  yearRange: any = [];

  dayOptions: PickerColumnOption[];
  monthOptions: PickerColumnOption[];
  yearsOptions: PickerColumnOption[];
  hoursOptions: PickerColumnOption[];
  minutesOptions: PickerColumnOption[];

  isReadOnly = false;
  isOpen = false;

  iconStyle = {
    position: 'absolute',
    right: '5px',
    top: '8px',
  };

  propertiesOptions: any;

  constructor(private pickerController: PickerController) {}
  checkHashFormat(val: string) {
    return val.indexOf('#') > -1;
  }
  get isError() {
    return this.validateForm.get(this.properties.id);
  }
  ngOnInit() {
    // console.log('Input Val : ', this.properties, !this.checkHashFormat(this.properties.value) ? this.properties.value : this.formatDate());
    this.frmYearRange =
      this.properties.yearRange != ''
        ? this.properties.yearRange
        : 'c-100:c+100';
    let res = this.frmYearRange.split(':');
    this.datePickerType =
      this.properties.datePickerType != ''
        ? this.properties.datePickerType
        : '';

    res.forEach((c) => {
      let newC = c.replace('c', '');
      let intC = parseInt(newC);
      this.yearRange.push(intC);
    });
    this.inputValBack = !this.checkHashFormat(this.properties.value)
      ? this.properties.value
      : this.formatDate();
    this.initVal();
    this.validateForm.get(this.properties.id)?.valueChanges.subscribe((val) => {
      if (!val) return;
      // console.log('date', val, this.inputValBack);
      if (val === this.inputValBack && val !== 'Invalid date') {
        this.inputValBack = val;
        this.initVal();
      }
    });
    if (
      this.formHook &&
      this.formHook[this.properties.id] &&
      typeof this.formHook[this.properties.id].before !== 'undefined'
    ) {
      this.formHook[this.properties.id].before(this);
    }
  }
  formatDate(currentDatetime: Date = new Date()): string {
    if (this.datePickerType === 'timeOnly') {
      const cHour = currentDatetime.getHours();
      const cMinute = currentDatetime.getMinutes();
      const newHour = ('0' + cHour).slice(-2);
      const newMinute = ('0' + cMinute).slice(-2);
      return `${newHour}:${newMinute}`;
    }
    const cMonth = currentDatetime.getMonth() + 1;
    const myYears = currentDatetime.getFullYear();
    const newM = cMonth < 10 ? '0' + cMonth : cMonth;
    const newD =
      currentDatetime.getDate() < 10
        ? '0' + currentDatetime.getDate()
        : currentDatetime.getDate();
    // tslint:disable-next-line: max-line-length
    return `${myYears}-${newM}-${newD}`;
  }
  initVal() {
    let propsDate: Date;
    if (this.datePickerType === 'timeOnly') {
      const nDay = new Date();
      this.dayVal = nDay.getDate();
      this.monthVal = nDay.getMonth() + 1;
      this.yearVal = nDay.getFullYear();

      propsDate = this.inputValBack
        ? new Date(
            this.yearVal +
              '-' +
              this.monthVal +
              '-' +
              this.dayVal +
              ' ' +
              this.inputValBack
          )
        : new Date();
      this.hourVal = propsDate.getHours();
      this.minuteVal = propsDate.getMinutes();
      this.hoursOptions = this.getHours();
      this.minutesOptions = this.getMinutes();
    } else {
      propsDate = this.inputValBack ? new Date(this.inputValBack) : new Date();
      this.dayVal = propsDate.getDate();
      this.monthVal = propsDate.getMonth() + 1;
      this.yearVal = propsDate.getFullYear();
      this.dayOptions = this.getDay();
      this.monthOptions = this.getMonth();
      this.yearsOptions = this.getYear();
    }

    this.inputValBack = this.getValBack();
  }

  getDisplayDate() {
    if (this.datePickerType === 'timeOnly') {
      const hVal = ('0' + this.hourVal).slice(-2);
      const mVal = ('0' + this.minuteVal).slice(-2);
      return hVal + ':' + mVal;
    }
    return (
      this.dayVal + ' ' + fullMonth[this.monthVal] + ' ' + (this.yearVal + 543)
    );
  }

  getIndexByOptions(options: PickerColumnOption[]) {
    return options.findIndex((item) => item.selected);
  }
  getValBack() {
    // tslint:disable-next-line: max-line-length
    let reformat;
    if (this.datePickerType === 'timeOnly') {
      const currentTime =
        ('0' + this.hourVal).slice(-2) + ':' + ('0' + this.minuteVal).slice(-2);
      console.log('currentTime', currentTime);
      reformat = currentTime;
    } else {
      const currentTime =
        this.yearVal +
        '-' +
        (this.monthVal < 10 ? '0' + this.monthVal : this.monthVal) +
        '-' +
        (this.dayVal < 10 ? '0' + this.dayVal : this.dayVal);
      reformat = moment(currentTime).format('yyyy-MM-DD');
    }

    return reformat;
  }
  async showPicker() {
    if (this.isReadOnly == false) {
      console.log('datePickerType', this.datePickerType);
      this.isOpen = true;
      let options: PickerOptions;
      if (this.datePickerType === 'timeOnly') {
        options = {
          buttons: [
            {
              text: 'ยกเลิก',
              role: 'cancel',
              handler: () => {
                this.isOpen = false;
              },
            },
            {
              text: 'ตกลง',
              handler: (value: any) => {
                console.log('value', value);
                this.hourVal = value.hours.value;
                this.minuteVal = value.minutes.value;
                this.inputValBack = this.getValBack();
                console.log('inputValBack', this.inputValBack);
                this.isOpen = false;
                this.validateForm.get(this.formId)?.setValue(this.inputValBack);
              },
            },
          ],
          columns: [
            {
              name: 'hours',
              options: this.getHours(),
              selectedIndex: this.getIndexByOptions(this.hoursOptions),
            },
            {
              name: 'minutes',
              options: this.getMinutes(),
              selectedIndex: this.getIndexByOptions(this.minutesOptions),
            },
          ],
        };
      } else {
        this.initVal();
        options = {
          buttons: [
            {
              text: 'ยกเลิก',
              role: 'cancel',
              handler: () => {
                this.isOpen = false;
              },
            },
            {
              text: 'ตกลง',
              handler: (value: any) => {
                this.dayVal = value.days.value;
                this.monthVal = value.months.value;
                this.yearVal = value.years.value;
                this.inputValBack = this.getValBack();
                this.isOpen = false;
                this.validateForm.get(this.formId)?.setValue(this.inputValBack);
              },
            },
          ],
          columns: [
            {
              name: 'days',
              options: this.getDay(),
              selectedIndex: this.getIndexByOptions(this.dayOptions),
            },
            {
              name: 'months',
              options: this.getMonth(),
              selectedIndex: this.getIndexByOptions(this.monthOptions),
            },
            {
              name: 'years',
              options: this.getYear(),
              selectedIndex: this.getIndexByOptions(this.yearsOptions),
            },
          ],
        };
      }
      const picker = await this.pickerController.create(options);
      picker.present();
    }
  }
  getYear() {
    const options = [];
    for (let i = this.yearVal + 100; i > this.yearVal - 100; i--) {
      const option: PickerColumnOption = {
        text: (i + 543).toString(),
        value: i,
        selected: this.yearVal === i,
      };
      options.push(option);
    }
    return options;
  }
  getDay() {
    const options = [];
    for (let i = 1; i < 32; i++) {
      const option: PickerColumnOption = {
        text: i.toString(),
        value: i,
        selected: this.dayVal === i,
      };
      options.push(option);
    }
    return options;
  }

  getMonth() {
    const options = [];
    for (let i = 1; i < 13; i++) {
      const option: PickerColumnOption = {
        text: shortMonth[i],
        value: i,
        selected: this.monthVal === i,
      };
      options.push(option);
    }
    return options;
  }

  getDayByMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }

  getHours() {
    const options = [];
    for (let i = 0; i < 24; i++) {
      const option: PickerColumnOption = {
        text: i.toString(),
        value: i,
        selected: this.hourVal === i,
      };
      options.push(option);
    }
    return options;
  }

  getMinutes() {
    const options = [];
    for (let i = 0; i < 60; i++) {
      const option: PickerColumnOption = {
        text: i.toString(),
        value: i,
        selected: this.minuteVal === i,
      };
      options.push(option);
    }
    return options;
  }
}
