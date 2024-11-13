import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { TestJogetService } from '../services/test-joget.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TestData } from '../services/test-joget.model';

@Component({
  selector: 'app-clipboards',
  templateUrl: './clipboards.page.html',
  styleUrls: ['./clipboards.page.scss'],
})
export class ClipboardsPage implements OnInit {
  public form: FormGroup;
  @Output() filePick = new EventEmitter<string | File>();
  @Output() filePick2 = new EventEmitter<string | File>();
  selectedFile: string;
  selectedFile2: string;
  selectedFiles: any;
  public rFile: TestData;
  public allFiles: Array<File> = [];
  public nb1form = "1";
  public filesToUpload: Array<File> = [];
  public sTest = "0";
  statesByTest:any = {
    1: ['fffff', 'aaaaaa', 'gggggg'],
    2: ['11111', '22222', '33333'],
    3: ['zzzzz', 'xxxxx', 'cccccc'],
  };
  states = [];

  constructor(private testJoget: TestJogetService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl( null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      topic: new FormControl( null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      fileUpload: new FormControl( null ),
      description: new FormControl( null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      detail: new FormControl( null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      fileUpload2: new FormControl( null ),
      selectTest: new FormControl( null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      selectState: new FormControl( '', {
        updateOn: 'change',
        validators: [Validators.required]
      })
    })

  }

  onFilePicked(file: string | File) {
    let dataFile;
    if (typeof file === 'string') {
      const base64info = this.testJoget.getInfoFromBase64(file);
      let mine = base64info.mime;
      let extension = base64info.extension;
      let meta = base64info.meta;
      let rawBase64 = base64info.rawBase64;
      // console.log("base64info", base64info);
      try {
        dataFile = this.testJoget.base64toBlob(rawBase64, mine);
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      dataFile = file;
    }
    // console.log("onFilePicked", dataFile);
    this.form.patchValue({ fileUpload: dataFile });
  }


  onAddJoget(){
    // this.testJoget.addData();
    // console.log("name", this.form.value.name);
    // console.log("topic", this.form.value.topic);
    // console.log("fileUpload", this.selectedImage);
    // console.log("this.selectedFile",this.selectedFile);
    // this.onFilePicked(this.selectedFile);
    // console.log("form", this.form);
    // this.testJoget.addData(
    //   this.form.value.name,
    //   this.form.value.topic,
    //   this.form.get('fileUpload').value,
    //   this.form.value.description,
    //   this.form.value.detail,
    //   this.form.get('fileUpload2').value,
    // );
    this.testJoget.tAddData(
      this.form.value.name,
      this.form.value.topic,
      this.filesToUpload
    );
  }


  onFileChosen2(e: Event) {
    // console.log("Event", e);
    const allFile = (e.target as HTMLInputElement).files as any;
    // console.log("allFile", allFile);
    // const pickedFile = (e.target as HTMLInputElement).files[0];
    // if (allFile.length === 0) {
    //   return;
    // }
    let cc = 0;
    // this.allFiles = (e.target as HTMLInputElement).files;
    Array.from(allFile).forEach((aFile:any) => {
      cc++;
      this.allFiles.push(aFile);
    
      // console.log("allFiles",this.allFiles);
      // const fr = new FileReader();
      // fr.onload = (f) => {
      //   console.log("f"+cc, f);
      //   // const dataUrl = fr.result.toString();
      //   // // console.log("dataUrl"+cc, dataUrl);
      //   // this.selectedFile = dataUrl;
      //   // // this.selectedFiles;
      //   // this.filePick.emit(pickedFile);
      // };
      // // fr.readAsDataURL(pickedFile)
      // fr.readAsArrayBuffer(aFile);
    })
  }

  onFileChosen(fileInput: any) {
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  onSelected(): void {
    console.log("onSelected", this.form.get("selectTest")?.value, this.form.get("selectTest"));
    this.sTest = this.form.get("selectTest")?.value;
    this.states = this.statesByTest[this.form.get("selectTest")?.value];
    console.log("this.states", this.states);
  }

  onSelectedTest(): void {
    console.log("onSelected", this.form.get("selectState")?.value, this.form.get("selectState"));
  }

  segmentChanged(e: Event){
    console.log("segmentChanged", e);

  }

  customActionOptions: any = {
    header: 'State',
    subHeader: 'On Select State',
    message: '...'
  };

}
