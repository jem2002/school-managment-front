import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { JwtDto } from '../auth/models/jwt-dto';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

const AUTHORIZATION = 'Authorization';

@Injectable({
  providedIn: 'root'
})
export class EstudianteInterceptorService implements HttpInterceptor{

  constructor(private tokenService: TokenService, private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    

    if(!this.tokenService.isAuthenticated()){
      return next.handle(req);
    }

    let intReq = req;
    const token = this.tokenService.getToken();

    intReq = this.addToken(intReq, token);
    

    return next.handle(intReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.status === 401){
          const dto: JwtDto = new JwtDto(token);

          return this.authService.refreshToken(dto)
                     .pipe(concatMap((data: any) => {
                       this.tokenService.setToken(data.token);
                       intReq = this.addToken(intReq, data.token);
                       return next.handle(intReq);
                     }));

        }

        if(err.status === 500){ 
           Swal.fire('Error', 'Algo salió mal','error')
           return throwError(err);
        }

        if(err.status === 0){ 
          Swal.fire('Error', 'Algo salió mal','error')
          this.tokenService.onLogout();
          return throwError(err);
       }
          
        return throwError(err);

      })
    );
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone(({headers: req.headers.set(AUTHORIZATION , 'Bearer ' + token)}));
  }

}

export const interceptorProvider = [{provide: HTTP_INTERCEPTORS, useClass: EstudianteInterceptorService, multi: true}]
