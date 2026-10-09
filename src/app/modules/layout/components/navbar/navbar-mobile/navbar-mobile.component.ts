
import {Component, OnInit} from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import {MenuService} from "../../../services/menu.service";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarMobileMenuComponent } from './navbar-mobile-menu/navbar-mobile-menu.component';

@Component({
  selector: 'app-navbar-mobile',
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.scss'],
  standalone: true,
  // SvgIconComponent importé : sans lui, <svg-icon> restait une balise vide (masqué par CUSTOM_ELEMENTS_SCHEMA)
  imports: [CommonModule, RouterModule, NavbarMobileMenuComponent, SvgIconComponent],
})
export class NavbarMobileComponent implements OnInit{
  ngOnInit() {

  }
  constructor(public menuService:MenuService) {
  }
  toggleMobileMenu():void{
    this.menuService.showMobileMenu= false;
  }
}
