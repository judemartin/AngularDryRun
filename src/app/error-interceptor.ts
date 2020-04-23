import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ErrorComponent } from "./error/error/error.component";

export class ErrorInterceptor implements HttpInterceptor {
     
    // constructor(private dialog: MatDialog, 
    //     @Inject(MAT_DIALOG_DATA) public data: any) {  
    // }

    intercept(req: HttpRequest<any>, next: HttpHandler) { 
        return next.handle(req)
        .pipe(
           catchError((error: HttpErrorResponse) => {
                console.log(error);
                //this.dialog.open(ErrorComponent);
                //console.log(error);
                alert(error.error.error.message);
                return throwError(error);
           })
        );
    } 
}