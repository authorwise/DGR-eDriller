import { Component, OnInit, ViewChild } from '@angular/core';

import formData from "../../../../../json/reqRenewalLicenseForMobile.json";
import { IFormElement, IFormPreFetch } from '../../../../models/formcontrol';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { toFormData } from '../../../..//tools/form';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  formObjElm: IFormElement;
  validateForm: FormGroup;
  stepValidateForm: FormGroup[];
  preFetch: IFormPreFetch[];
  currentStep = 1;
  formHook = {};
  @ViewChild(IonContent, { static: false }) content: IonContent;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formObjElm = { ...JSON.parse(formData.json) };
    console.log(this.formObjElm.elements);
    this.formObjElm.elements.forEach((element:any) => {
      // console.log(element.properties.);
    });
    this.stepValidateForm = [];
    for (let i = 0; i < 3; i++) {
      this.stepValidateForm.push(this.fb.group({}));
    }
    this.validateForm = this.fb.group({});
    this.preFetch = [];
  }

  submitForm() {
    console.log("Before form :", this.validateForm);
    if (!this.validateForm.valid) {
      return;
    }
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    const formData = toFormData(this.validateForm.value);
    console.log("form : ", this.validateForm);
    console.log("form data : ", formData);
  }

  //Step
  prevStep() {
    this.currentStep -= 1;
    this.scrollToTop();
  }
  nextStep() {
    this.currentStep += 1;
    this.scrollToTop();
  }
  scrollToTop() {
    this.content.scrollToTop(1000);
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit : ", this.validateForm);
    console.log("ngAfterViewInit preFetch : ", this.preFetch);

    // this.validateForm.get('staffMake').valueChanges.subscribe(val => {
    //   console.log(val);
    // });
  }

}
