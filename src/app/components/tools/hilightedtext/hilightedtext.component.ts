import { Component, Input, OnChanges, OnInit } from "@angular/core";

@Component({
  selector: 'highlighted-text',
  template: `
        <ng-container *ngFor="let match of result">
            <mark *ngIf="(match === needle); else nomatch">{{match}}</mark>
            <ng-template #nomatch>{{match}}</ng-template>
        </ng-container>
    `,
})
export class HilightedtextComponent implements OnInit {
  ngOnInit(): void { }
  @Input() needle: string;
  @Input() haystack: string;
  public result: string[];

  ngOnChanges() {
    // console.log('HilightedtextComponent', this.needle, this.haystack)
    if (this.needle !== '') {
      const regEx = new RegExp('(' + this.needle + ')', 'i');
      this.result = this.haystack.split(regEx);
    } else {
      this.result = this.haystack.split('');
    }

  }

}
