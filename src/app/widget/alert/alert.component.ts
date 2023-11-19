import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  @Input() category: string = 'info';
  @Input() message: string = 'This is an info alert';
  @Input() withLink: boolean = false;
  @Input() link: string = '#';
}
