import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IFormHookItems } from 'src/app/models/formcontrol';

@Component({
  selector: 'app-atwhidden',
  templateUrl: './atwhidden.component.html',
  styleUrls: ['./atwhidden.component.scss'],
})
export class AtwhiddenComponent implements OnInit, AfterContentInit {
  @Input() properties: any;
  @Input() formId: string;
  @Input() validateForm: FormGroup;
  @Input() formHook: any;
  @Input() visibilityControl: string;
  @Input() visibilityValue: string;

  propertiesOptions: any;
  isReadOnly = false;

  inputValBack: string;
  label: string;
  isOpen = false;
  constructor() { }

  ngOnInit() {
    this.inputValBack = this.properties.value;
    this.propertiesOptions = { ...this.properties };

    if (this.formHook && this.formHook[this.properties.id] && typeof this.formHook[this.properties.id].before !== 'undefined') {
      this.formHook[this.properties.id].before(this);
    }
    this.validateForm.get(this.properties.id)?.setValue(this.inputValBack);
  }

  ngAfterContentInit(): void {
    this.hookGenerate();
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
        if (this.validateForm.get(sub.formId)) {
          this.validateForm.get(sub.formId)?.valueChanges.subscribe((val) => { sub.cb(val, _this) });
        }
      }
    }
  }
}
