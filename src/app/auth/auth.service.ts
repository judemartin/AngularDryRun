import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
 
@Injectable({providedIn: "root"})
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private authStatusListener = new  Subject<boolean>();
    constructor(private http: HttpClient, private router: Router) { 

    }
    getToken() { 
        return this.token;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }
    
    getIsAuth() {
        return this.isAuthenticated;
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']); 
    }

    clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        console.log(localStorage);
    }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        console.log(localStorage);
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if(!authInformation)
            return
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        console.log(authInformation, expiresIn);
        if(expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    private setAuthTimer(duration: number) {
        console.log(`setting timer ${duration}`);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }
    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if(!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }

    createUser(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        };
        this.http.post("http://localhost:3000/api/user/signup", authData)
        .subscribe(response => {
            console.log(response);
         }); 
    }

    loginUser(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        };
        this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/user/login", authData)
        .subscribe(response => {
            const token = response.token; 
            this.token = token;
            if(token) {
                const expiresInDuration = response.expiresIn;
                this.setAuthTimer(expiresInDuration); 
                console.log(expiresInDuration);
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                console.log("expirationDate" + expirationDate);
                this.saveAuthData(token, expirationDate)
                this.router.navigate(['/']);
            }
        }); 
    }
}