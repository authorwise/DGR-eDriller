import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-basicheader',
  templateUrl: './basicheader.component.html',
  styleUrls: ['./basicheader.component.scss'],
})
export class BasicheaderComponent implements OnInit {
  @Input() dHref: string;
  @Input() backText: string;
  @Input() pageTopic: string;
  constructor() { }

  ngOnInit() { }

}
