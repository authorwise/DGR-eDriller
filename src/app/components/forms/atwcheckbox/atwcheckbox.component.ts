import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { IFormCheckboxOption } from '../../../models/formcontrol';

@Component({
  selector: 'app-atwcheckbox',
  templateUrl: './atwcheckbox.component.html',
  styleUrls: ['./atwcheckbox.component.scss'],
})
export class AtwcheckboxComponent implements OnInit {
  @Input() properties: IFormCheckboxOption;
  @Input() validateForm: FormGroup;
  checkboxValue = false;
  options: { label: string, value: any} | any = [];
  constructor() {}

  ngOnInit() {
    this.options = this.properties.options.map((ops:any) => {
      return {
        label: ops.label,
        value: ops.value
      }
    });
  }
  get isError() {
    return this.validateForm.get(this.properties.id)
  }

  log(value: object[]): void {
    this.validateForm.get(this.properties.id)?.setValue(value.length === 1 ? value[0] : value);
  }
}
