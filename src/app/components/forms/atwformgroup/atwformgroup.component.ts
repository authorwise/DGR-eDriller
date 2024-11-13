
import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IonMenuToggle } from '@ionic/angular';
import { IFormElement, IFormPreFetch } from 'src/app/models/formcontrol';
declare var $: any;
@Component({
  selector: 'app-atwformgroup',
  templateUrl: './atwformgroup.component.html',
  styleUrls: ['./atwformgroup.component.scss'],
})
export class AtwformgroupComponent implements OnInit, OnDestroy, AfterViewInit, OnDestroy {
  @Input() preFetch: IFormPreFetch[];
  @Input() elements: IFormElement[];
  @Input() stepValidateForm: FormGroup;
  @Input() formHook: any;
  sectionData: IFormElement[];
  @Input() validateForm: FormGroup;
  @Input() mapPickerBind: any;
  @Input() spreadsheetPickerBind: any;
  @Input() beforeLabel: any;
  formattedMessage: string;

  constructor() { }
  ngOnDestroy(): void {
    window.removeEventListener('keyboardDidShow', this.keyboardDidShow);
    window.removeEventListener('keyboardDidHide', this.keyboardDidHide);
  }

  onsubmitForm() {
    if (!this.validateForm.valid) {
      return;
    }
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    return false;
  }

  ngOnInit() {
    this.sectionData = [...this.elements];
  }
  keyboardDidHide = () => {
    let ionapp = document.getElementsByTagName("ion-app")[0] as any;
    ionapp.style["margin-bottom"] = "0px";
  }
  keyboardDidShow = async (event:any) => {
    // Move ion-app up, to give room for keyboard
    let ionapp = document.getElementsByTagName("ion-app")[0] as any;
    let kbHeight: number = event["keyboardHeight"];
    let viewportHeight: number = $(window).height();
    let inputFieldOffsetFromBottomViewPort: number = viewportHeight - $(':focus')[0].getBoundingClientRect().bottom;
    let inputScrollPixels = kbHeight - inputFieldOffsetFromBottomViewPort;

    // Set margin to give space for native keyboard.
    ionapp.style["margin-bottom"] = kbHeight.toString() + "px";

    // But this diminishes ion-content and may hide the input field...
    if (inputScrollPixels > 0) {
      // ...so, get the ionScroll element from ion-content and scroll correspondingly
      // The current ion-content element is always the last. If there are tabs or other hidden ion-content elements, they will go above.
      let ionScroll = await $("ion-content").last()[0].getScrollElement();
      setTimeout(() => {
        $(ionScroll).animate({
          scrollTop: ionScroll.scrollTop + inputScrollPixels
        }, 300);
      }, 300); // Matches scroll animation from css.
    }
  }
  ngAfterViewInit() {


    window.addEventListener('keyboardDidShow', this.keyboardDidShow);
    window.addEventListener('keyboardDidHide', this.keyboardDidHide);

  }

  onChanges(val: any): void {
    this.formattedMessage =
      `Hello,

      My name is ${val.name} and my email is ${val.email}.

      I would like to tell you that ${val.message}.`;
  }
}
