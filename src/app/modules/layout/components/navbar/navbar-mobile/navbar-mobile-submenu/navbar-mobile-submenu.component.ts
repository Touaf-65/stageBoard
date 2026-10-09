
import {Component, Input, OnInit} from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import {MenuService} from "../../../../services/menu.service";
import {SubMenuItem} from "../../../../../../core/models/menu.model";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar-mobile-submenu',
  templateUrl: './navbar-mobile-submenu.component.html',
  styleUrls: ['./navbar-mobile-submenu.component.scss'],
  standalone: true,
  // SvgIconComponent importé : sans lui, <svg-icon> restait une balise vide (masqué par CUSTOM_ELEMENTS_SCHEMA)
  imports: [CommonModule, RouterModule, SvgIconComponent],
})
export class NavbarMobileSubmenuComponent implements OnInit{

  @Input()
  public submenu= <SubMenuItem>{};
  ngOnInit() {

  }
  constructor(private menuService:MenuService) {
  }
  toggleMenu(menu:any){
    this.menuService.toggleSubMenu(menu)
  }

  collapse(items:Array<any>){
    items.forEach((item)=>{
      item.expanded= false;
      if(item.children) this.collapse(item.children)
    });
  }
  public closeMobileMenu(){
    this.menuService.showMobileMenu= false;
  }
}
