import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IFormElement } from 'src/app/models/formcontrol';
import { FormBuilder, FormGroup } from '@angular/forms';
import { toFormData } from 'src/app/tools/form';
import axios from 'axios-observable';

const testElement: IFormElement = {
  className: "org.joget.apps.form.model.Section",
  elements: [{
    className: "org.joget.apps.form.model.Section",
    elements: [
      {
        className: "org.joget.apps.form.model.Column",
        elements: [{
          className: "org.joget.apps.form.lib.HiddenField",
          properties: { useDefaultWhenEmpty: "", workflowVariable: "", id: "test01", value: "1" }
        },
        {
          className: "org.joget.apps.form.lib.TextField",
          properties: {
            label: "test2",
            useDefaultWhenEmpty: "",
            workflowVariable: "",
            id: "test02",
            value: "75120",
            validator: {
              className: 'org.joget.apps.form.lib.DefaultValidator', properties: { type: '', message: '', mandatory: true }
            }
          }
        },
        {
          className: "org.joget.apps.form.lib.TextArea",
          properties: {
            useDefaultWhenEmpty: "", workflowVariable: "", label: "test3",
            id: "test03",
            value: "บ้านปราโมทย์",
            validator: {
              className: 'org.joget.apps.form.lib.DefaultValidator',
              properties: {
                type: '',
                message: '',
                mandatory: true
              }
            }
          }
        },
        {
          className: "org.joget.apps.form.lib.TextField",
          properties: {
            label: "Latitude",
            useDefaultWhenEmpty: "",
            workflowVariable: "",
            id: "latitude",
            value: "",
            validator: {
              className: 'org.joget.apps.form.lib.DefaultValidator', properties: { type: '', message: '', mandatory: true }
            }
          }
        },
        {
          className: "org.joget.apps.form.lib.TextField",
          properties: {
            label: "Longitude",
            useDefaultWhenEmpty: "",
            workflowVariable: "",
            id: "longitude",
            value: "",
            validator: {
              className: 'org.joget.apps.form.lib.DefaultValidator', properties: { type: '', message: '', mandatory: true }
            }
          }
        },
        {
          className: 'org.joget.apps.form.lib.DatePicker',
          properties: {
            permissionHidden: '',
            yearRange: 'c-10:c+10',
            dataFormat: 'yyyy-MM-dd',
            startDateFieldId: '',
            validator: { className: 'org.joget.apps.form.lib.DefaultValidator', properties: {} },
            format: 'dd\\/mm\\/yy', label: 'วันที่', datePickerType: '', currentDateAs: '', endDateFieldId: '', readonly: true, allowManual: '', workflowVariable: '', id: 'requestDate', placeholder: '', value: '#date.yyyy-MM-dd#', readonlyLabel: ''
          }
        },
        {
          className: 'org.joget.apps.form.lib.Radio',
          properties: {
            permissionHidden: '',
            controlField: '',
            readonly: '',
            optionsBinder:
            {
              className: '',
              properties: {}
            },
            permission_rules: {},
            options: [
              { label: 'บุคคลธรรมดา', value: 'person', grouping: '' },
              { label: 'นิติบุคคล', value: 'company', grouping: '' }],
            validator: { className: 'org.joget.apps.form.lib.DefaultValidator', properties: {} },
            workflowVariable: '',
            id: 'requesterStatus',
            label: 'ประเภท',
            value: '',
            readonlyLabel: ''
          }
        },
        {
          className: 'org.joget.apps.form.lib.FileUpload',
          properties: {
            resizeMethod: '',
            permissionType: '',
            padding: '',
            maxSizeMsg: 'File size limit exceeded',
            resizeWidth: '',
            permission_rules: {},
            multiple: '',
            validator: {
              className: 'org.joget.apps.form.lib.DefaultValidator',
              properties: {}
            },
            value: '',
            maxSize: '',
            label: 'อัพโหลดเอกสาร 1',
            resizeQuality: 0.8,
            removeFile: '',
            readonly: '',
            attachment: '',
            size: '',
            fileTypeMsg: 'Invalid file type',
            id: 'personDocFile1',
            resizeHeight: '', fileType: ''
          }
        },
        {
          className: 'org.joget.plugin.enterprise.RichTextEditorField',
          properties: {
            editor: 'quill',
            permissionType: '',
            readonly: '',
            validator: {
              className: '',
              properties: {}
            },
            id: 'answer',
            label: 'คำตอบ',
            placeholder: '',
            value: '',
            qmode: '',
            switch: '',
            height: '150'
          }
        }, {
          className: 'org.joget.plugin.enterprise.SpreadSheetGrid',
          properties: {
            showRowNumber: true,
            validateMaxRow: 31,
            disabledDelete: '',
            validateMinRow: '',
            validator: {
              className: '',
              properties: {}
            },
            errorMessage: 'Invalid number of rows',
            fixedColumnsLeft: 0,
            label: '',
            headerSorting: true,
            storeBinder: {
              className: 'org.joget.plugin.enterprise.MultirowFormBinder',
              properties: {
                formDefId: 'reportNBt11Using',
                foreignKey: 'parentID'
              }
            },
            minSpareRows: 1,
            sortingField: '',
            readonly: '',
            loadBinder: {
              className: 'org.joget.plugin.enterprise.MultirowFormBinder',
              properties: {
                formDefId: 'reportNBt11Using',
                foreignKey: 'parentID'
              }
            },
            disabledAdd: '',
            maxHeight: '',
            options: [
              {
                readonly: '',
                format: 'reportNBt11Using',
                width: '',
                regexValidator: '',
                formula: '',
                label: 'วันที่',
                formatType: 'dropdown',
                value: 'day'
              },
              {
                readonly: '',
                format: '',
                width: '',
                regexValidator: '',
                formula: '',
                label: 'อ่านได้',
                formatType: 'numeric',
                value: 'readMeter'
              },
              {
                readonly: '',
                format: '',
                width: '',
                regexValidator: '',
                formula: '',
                label: 'ใช้น้ำ(ลบ.ม.)',
                formatType: 'numeric',
                value: 'use'
              },
              {
                readonly: '',
                format: 'reportNBt11Using',
                width: '',
                regexValidator: '',
                formula: '',
                label: 'หมายเหตุ',
                formatType: '',
                value: 'remark'
              }
            ],
            customSettings: '',
            id: 'usingWater'
          }
        },
        {
          className: 'org.joget.apps.form.lib.CheckBox', properties: {
            controlField: '',
            readonly: '',
            optionsBinder: {
              className: '', properties: {}
            }, permission_rules: {},
            options: [{
              label: 'รับรองข้อมูล', value: 'yes', grouping: ''
            }],
            validator: {
              className: 'org.joget.apps.form.lib.DefaultValidator',
              properties: {
                type: '',
                message: '',
                mandatory: true
              }
            },
            workflowVariable: '',
            id: 'acceptAgreement1',
            label: '',
            value: '',
            readonlyLabel: ''
          }
        }
        ],
        properties: { width: "100%" }
      }

    ],
    properties:
    {
      comment: "",
      id: "jjj",
      join: "",
      label: "",
      loadBinder: { className: "", properties: {} },
      permission: { className: "", properties: {} },
      permissionReadonly: "",
      readonly: "",
      readonlyLabel: "",
      regex: "",
      reverse: "",
      storeBinder: { className: "", properties: {} },
      visibilityControl: "",
      visibilityValue: ""
    }
  }]
}
@Component({
  selector: 'app-testcontrol',
  templateUrl: './testcontrol.page.html',
  styleUrls: ['./testcontrol.page.scss'],
})
export class TestcontrolPage implements OnInit {
  sectionData: IFormElement;
  validateForm: FormGroup;
  mapPickerBind = {
    lat: 'latitude',
    lng: 'longitude',
    zone: 'utmZone',
    n: 'nZone',
    e: 'eZone',
    findby: ['test02', 'test03']
  };
  spreadsheetPickerBind = {
    day: 'day',
    readMeter: 'readMeter',
    remark: 'remark',
    use: 'use',
  }
  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.sectionData = { ...testElement };
    this.validateForm = this.fb.group({});
  }

  submitForm() {
    console.log('Before form : ', this.validateForm);
    let headers:any = {};
    headers['Accept'] = '*/*';
    headers['Content-Type'] = 'multipart/form-data';
    headers['Authorization'] = 'Basic YWRtaW46YWRtaW4=';
    headers['User-Agent'] = 'PostmanRuntime/7.25.0';
    headers['Cookie'] = 'JSESSIONID=B5F2C646666405F228175B8C047FCBDF.jvm2';

    const fData = new FormData();

    fData.append('processID', 'sssss');
    fData.append('recordID', 'sssss');
    fData.append('activityID', 'sssss');
    fData.append('activityDefID', 'sssss');
    fData.append('feeValue', '10');
    fData.append('paymentMethod', 'credit');

    console.log(Array.isArray(this.validateForm.get('personDocFile1')?.value));

    if (Array.isArray(this.validateForm.get('personDocFile1')?.value)) {
      for (const val of this.validateForm.get('personDocFile1')?.value) {
        fData.append('silpFile', val);
      }
    } else {
      fData.append('silpFile', this.validateForm.get('personDocFile1')?.value.getAsBinary());
    }


    const jData = {
      'processID': 'sssss',
      'recordID': 'sssss',
      'activityID': 'sssss',
      'activityDefID': 'sssss',
      'feeValue': '10',
      'paymentMethod': 'credit',
    }
    axios.request({
      method: 'POST',
      url: 'http://authorwise.co.th:8080/jw/api/form/paymentRequestFee/addWithFiles',
      // withCredentials: true,
      headers: {
        'Authorization': 'Basic a2FuOlBAc3N3MHJk',
        'api_id': 'API-d35ca6d3-29d0-48f2-98e1-e3e61f5b2ae3',
        'api_key': 'd5a1c2e138704e148daa0b6a274ce1a9'
        // 'Cache-Control': 'no-cache, no-store, must-revalidate',
        // 'Pragma': 'no-cache',
        // 'Expires': '0',
        // 'Content-Type': 'application/json'
        // 'Cookie': 'JSESSIONID=B5F2C646666405F228175B8C047FCBDF.jvm2',
        // 'Referrer-Policy': 'origin',
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
        // 'Access-Control-Allow-Headers': 'Authorization, Origin, Content-Type, X-CSRF-Token'
      },
      // timeout: 5000
      data: fData
      // data: JSON.stringify(jData)
    })
      // axios.get('http://authorwise.co.th:8080/jw/api/list/list_nb1AssignmentByUsername', {
      //   headers: {
      //     'Authorization': 'Basic a2FuOlBAc3N3MHJk',
      //     'api_id': 'API-d35ca6d3-29d0-48f2-98e1-e3e61f5b2ae3',
      //     'api_key': 'd5a1c2e138704e148daa0b6a274ce1a9'
      //   }
      // })
      .subscribe(resData => {
        if (resData.status === 200 || resData.status === 201) {
          console.log(resData.data);
        }
        return;
      });
    if (!this.validateForm.valid) {
      return;
    }
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    const formData = toFormData(this.validateForm.value);
    console.log('form : ', this.validateForm);
    console.log('form data : ', formData);

  }

  testRedirect() {
    this.router.navigateByUrl('/tabs/dgr/homes', { state: { redirectTo: '/tabs/dgr/my-request-forms' } });
  }
}
