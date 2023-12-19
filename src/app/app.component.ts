import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { NgbdDatepickerBasic } from "./date-picker/date-picker.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [CommonModule, RouterOutlet, NavBarComponent, NgbdDatepickerBasic]
})
export class AppComponent {
  title = 'proyecto4VGYMFinal';
}
