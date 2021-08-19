import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable } from 'rxjs';
import { of, throwError } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {map, catchError, tap} from 'rxjs/operators';
import swal from 'sweetalert2'
import { Router } from  '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint:string = "http://localhost:8080/api/clientes";

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  constructor(private http: HttpClient, private router: Router) {}

  getClientes(page:number): Observable<any>{
    //return of(CLIENTES);
    //idem
    //return this.http.get<any[]>(this.urlEndPoint + 'page' + page);
  return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
    tap((response:any) =>{

      (response.content as Cliente[]).forEach(cliente =>{
        console.log(cliente.nombre);
      })
    }),
      map( (response:any) => {

        (response.content as Cliente[]).map(cliente =>{
          cliente.nombre = cliente.nombre.toUpperCase();
          return cliente;
        });
        return response;
  }
),
tap(response =>{

  (response.content as Cliente[]).forEach(cliente =>{
    console.log(cliente.nombre);
  })
})
);
}

  create(cliente:Cliente): Observable<any>{
    return this.http.post<any>(this.urlEndPoint,cliente,{headers:this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal('Error al crear el cliente', e.error.mensaje,'error');
        return throwError(e);
      })
    )
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if(e.status==400){
          return throwError(e);
        }
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal('Error al editar',e.error.mensaje,'error');
        return throwError(e);
      })
    )
  }

  update(cliente: Cliente):Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal('Error al editar el cliente', e.error.mensaje,'error');
        return throwError(e);
      })
    )
  }

  delete(id: number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers:this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal('Error al eliminar el cliente', e.error.mensaje,'error');
        return throwError(e);
      })
    )
  }
}
