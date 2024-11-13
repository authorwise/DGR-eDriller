import { FormGroup, Validators, FormControl } from '@angular/forms';
import { formTypeMap } from './../../../models/form.dic';
import { IFormElement, IFormPreFetch, IFormHookItems } from './../../../models/formcontrol';
import { Component, OnInit, Input, AfterViewInit, AfterContentInit } from '@angular/core';

@Component({
  selector: 'app-atwformcontrol',
  templateUrl: './atwformcontrol.component.html',
  styleUrls: ['./atwformcontrol.component.scss'],
})
export class AtwformcontrolComponent implements OnInit, AfterViewInit, AfterContentInit {
  @Input() element: IFormElement;
  @Input() validateForm: FormGroup;
  @Input() stepValidateForm: FormGroup;
  @Input() preFetch: IFormPreFetch[];

  @Input() visibilityControl: string;
  @Input() visibilityValue: string;
  @Input() formHook: any;
  @Input() mapPickerBind: any;
  @Input() spreadsheetPickerBind: any;
  @Input() beforeLabel: any;
  properties: any;
  propertiesOptions: any;
  isReadOnly = false;
  topLabel: any;
  constructor() { }

  get getTopLabel() {
    if(this.beforeLabel && this.beforeLabel[this.properties.id]){
      return this.beforeLabel[this.properties.id];
    }
    return '';
  }

  ngOnInit() {
    if(this.getFormType() === 'spreadsheet'){
      console.log('spreadsheet', this.element.properties);
    }
    this.properties = { ...this.element.properties };
    this.propertiesOptions = this.properties;
    if (this.formHook && this.formHook[this.properties.id] && typeof this.formHook[this.properties.id].before !== 'undefined' && (
      this.getFormType() === 'textarea' || this.getFormType() === 'text'
    )) {
      this.formHook[this.properties.id].before(this);
    }
  }
  ngAfterContentInit(): void {
    if (this.getFormType() !== 'html' && this.getFormType() !== 'unbind' && this.element.properties.id !== '') {
      if (this.preFetch && this.element.properties.value && this.element.properties.value !== '' && this.element.properties.value.indexOf('#') > -1) {
        this.preFetch.push({
          formId: this.element.properties.id,
          hasValue: this.element.properties.value
        });
      }
      this.addFormControl(this.element.properties.id, this.element.properties.validator, this.element.properties.value || null);
    }
  }
  get isError() {
    return this.validateForm.get(this.element.properties.id)
  }

  ngAfterViewInit(): void {
    this.hookGenerate();
  }

  addFormControl(controlInstance: string, validatorsForm: any, defValue = '') {
    const validators = []
    if (validatorsForm && validatorsForm.className !== '') {
      validators.push(Validators.required)
    }


    this.validateForm.addControl(controlInstance, new FormControl(defValue, {
      updateOn: 'change',
      validators
    }));
    if (this.stepValidateForm) {
      this.stepValidateForm.addControl(controlInstance, new FormControl(defValue, {
        updateOn: 'change',
        validators
      }));
      this.validateForm.get(controlInstance)?.valueChanges.subscribe(val => {
        this.stepValidateForm.get(controlInstance)?.setValue(val);
      });
    }
  }
  getFormType() {
    return formTypeMap[this.element.className] || 'unbind';
  }

  hookGenerate() {
    if (this.formHook && this.formHook[this.properties.id] && (
      this.getFormType() === 'textarea' || this.getFormType() === 'text'
    )) {
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
