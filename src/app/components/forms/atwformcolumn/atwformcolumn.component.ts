import { IFormElement, IFormPreFetch, IFormVisible } from './../../../models/formcontrol';
import { Component, OnInit, Input, AfterViewInit, DoCheck } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-atwformcolumn',
  templateUrl: './atwformcolumn.component.html',
  styleUrls: ['./atwformcolumn.component.scss'],
})
export class AtwformcolumnComponent implements OnInit, AfterViewInit, DoCheck {
  @Input() elements: IFormElement;
  @Input() validateForm: FormGroup;
  @Input() stepValidateForm: FormGroup;
  @Input() preFetch: IFormPreFetch[];
  @Input() visibilityControl: string;
  @Input() visibilityValue: string;
  @Input() formHook: any;
  @Input() mapPickerBind: any;
  @Input() spreadsheetPickerBind: any;
  @Input() beforeLabel: any;
  columnElement: IFormElement;
  isVisible = true;

  hasValid:any = [];
  constructor() { }
  ngDoCheck(): void {
    if (!this.isVisible) {
      this.doClearValidate()
    } else {
      this.doSetValidate()
    }
  }
  doClearValidate() {
    if (!this.hasValid) return;
    for (const key in this.hasValid) {
      if (!this.validateForm.get(key)) {
        break;
      }
      this.validateForm.get(key)?.clearValidators();
      if(this.stepValidateForm){
        this.stepValidateForm.get(key)?.clearValidators();
      }
    }
  }
  doSetValidate() {
    if (!this.hasValid) return;
    for (const key in this.hasValid) {
      this.validateForm.get(key)?.setValidators([Validators.required]);
      if (this.stepValidateForm) {
        this.stepValidateForm.get(key)?.setValidators([Validators.required]);
      }
    }
  }
  ngOnInit() {
    this.columnElement = { ...this.elements };
  }

  getControlKey() {
    this.columnElement.elements.forEach((colEls: any) => {
      colEls.elements.forEach((colEl:any) => {
        if (colEl.properties.validator && colEl.properties.validator.className !== '') {
          this.hasValid[colEl.properties.id] = colEl.properties.validator.className;
        }
      });
    });
  }

  ngAfterViewInit() {
    // console.log(Object.keys(this.stepValidateForm.controls));
    this.getControlKey();
    const formSub = this.columnElement.properties.visibilityControl || '';
    const formSubValue = this.columnElement.properties.visibilityValue || '';

    if (formSub.indexOf(';') < 0) {
      const isReverse = this.columnElement.properties.reverse !== '' ? true : false;
      if (typeof formSub === 'string' && formSub.trim() !== '' && this.validateForm.get(formSub)) {
        if (this.validateForm.get(formSub)) {
          this.valcheck(this.validateForm.get(formSub)?.value, formSubValue, isReverse);
        }
        this.validateForm.get(formSub)?.valueChanges.subscribe(val => {
          this.valcheck(val, formSubValue, isReverse);
        })
      }
    } else {
      const _this = this;
      this.checkArrayValidate();
      const formSubArr = formSub.split(';');
      if (formSubArr.length > 1) {
        for (let i = 0; i < formSubArr.length; i++) {
          if(!this.validateForm.get(formSubArr[i])){
            continue;
          }
          this.validateForm.get(formSubArr[i])?.valueChanges.subscribe((_) => {
            _this.checkArrayValidate();
          })
        }
      }
    }

    if (!this.isVisible) {
      this.doClearValidate()
    } else {
      this.doSetValidate()
    }
  }

  checkArrayValidate() {
    // console.log('checkArrayValidate : ' , this.columnElement.properties)
    const formSub = this.columnElement.properties.visibilityControl || '';
    const formSubValue = this.columnElement.properties.visibilityValue || '';
    const formSubArr = formSub.split(';');
    const fromSubValArr = formSubValue.split(';');
    const joinArr = this.columnElement.properties.join.split(';');
    const reverseArr = this.columnElement.properties.reverse.split(';');
    if (formSubArr.length > 1) {
      let res: IFormVisible[] = [];
      for (let i = 0; i < formSubArr.length; i++) {
        res.push({ key: formSubArr[i], val: fromSubValArr[i], join: joinArr[i], reverse: reverseArr[i] });
      }
      const _this = this;
      const isvisible = res.reduce((prev, item) => {
        let concheck = false;
        console.log('reduce : ' , item.key , ' : ' , prev, _this.validateForm.get(item.key))
        if(!_this.validateForm.get(item.key) ||  !_this.validateForm.get(item.key)?.value){
          return false;
        }
        const formVal = _this.validateForm.get(item.key)?.value;
        console.log('item.val : ' , item.val , ' | ' , formVal)
        if (item.val.toString() === formVal.toString()) {
          concheck = true;
        }
        concheck = item.join === 'or' ? prev || concheck : prev && concheck;
        return concheck;
      }, true);
      this.isVisible = isvisible;
    }
  }

  valcheck(val: string, formSubValue: string | number, isReverse = false) {
    if (!val) {
      this.isVisible = isReverse ? true : false;
    }
    if (val === formSubValue) {
      this.isVisible = isReverse ? false : true;
    } else {
      this.isVisible = isReverse ? true : false;
    }
  }
}
