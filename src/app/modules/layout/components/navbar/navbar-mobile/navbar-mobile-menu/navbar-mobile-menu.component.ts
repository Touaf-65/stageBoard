
import {Component, OnInit} from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import {MenuService} from "../../../../services/menu.service";
import {SubMenuItem} from "../../../../../../core/models/menu.model";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarMobileSubmenuComponent } from '../navbar-mobile-submenu/navbar-mobile-submenu.component';

@Component({
  selector: 'app-navbar-mobile-menu',
  templateUrl: './navbar-mobile-menu.component.html',
  styleUrls: ['./navbar-mobile-menu.component.scss'],
  standalone: true,
  // SvgIconComponent importé : sans lui, <svg-icon> restait une balise vide (masqué par CUSTOM_ELEMENTS_SCHEMA)
  imports: [CommonModule, RouterModule, NavbarMobileSubmenuComponent, SvgIconComponent],
})
export class NavbarMobileMenuComponent implements OnInit{

  ngOnInit() {

  }
  constructor(public  menuService:MenuService) {
  }

  public toggleMenu(subMenu: SubMenuItem){
    this.menuService.toggleMenu(subMenu)
  }
  closeMenu(){
    this.menuService.showMobileMenu=false;
  }
}
