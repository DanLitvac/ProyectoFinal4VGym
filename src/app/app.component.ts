import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { NgbdDatepickerBasic } from "./date-picker/date-picker.component";
import { PageBodyComponent } from "./page-body/page-body.component";
import { TabsComponent } from "./tabs/tabs.component";


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [CommonModule, RouterOutlet, NavBarComponent, NgbdDatepickerBasic, PageBodyComponent, TabsComponent,RouterLink,RouterLinkActive  ]
    
})
export class AppComponent {
  title = 'proyecto4VGYMFinal';
}
