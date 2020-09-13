import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router'
import PNotify from 'pnotify/dist/es/PNotify';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authservice:AuthService,private router:Router) { }

  ngOnInit() {
  }

  onLogoutClick(){console.log('work');
    this.authservice.logout();
    this.router.navigate(['/dashboard']);
    PNotify.info({text:'Logged Out Successfully!!'});
  }

}
