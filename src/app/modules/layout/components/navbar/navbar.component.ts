
import {Component, OnInit} from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import {MenuService} from "../../services/menu.service";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarMenuComponent } from './navbar-menu/navbar-menu.component';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobile.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  // SvgIconComponent importé : sans lui, <svg-icon> restait une balise vide (masqué par CUSTOM_ELEMENTS_SCHEMA)
  imports: [CommonModule, RouterModule, NavbarMenuComponent, ProfileMenuComponent, NavbarMobileComponent, SvgIconComponent],
})
export class NavbarComponent implements OnInit{
  ngOnInit() {
  }

  constructor(private menuService:MenuService) {
  }

  toggleMobileMenu(){
    this.menuService.showMobileMenu=true;
  }
}
