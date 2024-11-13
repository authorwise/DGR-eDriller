import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { IFormHookItems } from '../../../models/formcontrol';

@Component({
  selector: 'app-atwradio',
  templateUrl: './atwradio.component.html',
  styleUrls: ['./atwradio.component.scss'],
})
export class AtwradioComponent implements OnInit, AfterContentInit {
  @Input() validateForm: FormGroup;
  @Input() properties: any;
  @Input() formHook: any;
  @Input() visibilityControl: string;
  @Input() visibilityValue: string;

  propertiesOptions: any;
  radioValue = '1';
  isDisabled = false;
  style = {
    width: '100%',
    minHeight: '30px',
    marginBottom: '5px',
    maxHeight: 'auto',
    textOverflow: 'clip'
  };
  styleGroups = {
    ...this.style,
    maxHeight: 'auto',
    minHeight: 'auto',
  }
  constructor() { }

  ngOnInit() {
    this.radioValue = this.properties.value;
    this.propertiesOptions = this.properties;

    if (!this.propertiesOptions.visibilityControl && this.visibilityControl) {
      this.propertiesOptions.visibilityControl = this.visibilityControl;
      this.propertiesOptions.visibilityValue = this.visibilityValue;
    }

    if (this.formHook && this.formHook[this.properties.id] && typeof this.formHook[this.properties.id].before !== 'undefined') {
      this.formHook[this.properties.id].before(this);
    }
  }
  get isError() {
    return this.validateForm.get(this.properties.id)
  }

  ngAfterContentInit(): void {
    this.hookGenerate();
  }

  onRadioChange(val: string) { }
  trimstr(str: string) {
    return str.trim()
  }

  hookGenerate() {
    if (this.formHook && this.formHook[this.properties.id]) {
      const hooks: IFormHookItems = this.formHook[this.properties.id];

      if (typeof hooks.remaps !== 'undefined') {
        hooks.remaps(this, this.propertiesOptions.visibilityValue);
        this.validateForm
          .get(this.propertiesOptions.visibilityControl)?.valueChanges.subscribe((val) => {
            hooks.remaps(this, val);
          });
      }

      if (!hooks.subscribe) {
        return;
      }
      const _this = this;
      for (const sub of hooks.subscribe) {
        this.validateForm.get(sub.formId)?.valueChanges.subscribe((val) => { sub.cb(val, _this, sub.formId) });
      }
    }
  }
}
