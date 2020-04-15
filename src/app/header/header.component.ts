import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  styleUrls: ["./header.component.css"],
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent  implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription; 

constructor(private authService: AuthService) { }
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
   }
   onLogout() {
      this.authService.logout();
   }
}
