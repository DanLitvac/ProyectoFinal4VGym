import { Component } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { TabsComponent } from "../tabs/tabs.component";

@Component({
    selector: 'app-monitores',
    standalone: true,
    templateUrl: './monitores.component.html',
    styleUrl: './monitores.component.scss',
    imports: [NavBarComponent, TabsComponent]
})
export class MonitoresComponent {

}
