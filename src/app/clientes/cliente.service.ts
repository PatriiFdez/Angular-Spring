import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  // getClientes(): Observable<Cliente[]> {
    getClientes(page: number): Observable<any> {
    // return of(CLIENTES);
    return this.http.get<Cliente[]>(this.urlEndPoint + '/page/' + page)

    .pipe(
      tap( (response: any) => {
          console.log('ClientesComponent: tap 1');
          // let clientes = response as Cliente[];
          // clientes.forEach ( cliente => {
          (response.content as Cliente[]).forEach ( cliente => {
            console.log(cliente.nombre);
          })
        }
      ),
      map( (response: any) => {
          // let clientes = response as Cliente[];
          // return clientes.map(cliente => {
          (response.content as Cliente[]).map(cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
            // let datePipe = new DatePipe('es');
            // https://docs.angularjs.org/api/ng/filter/date
            // cliente.createAt = datePipe.transform(cliente.createAt, 'fullDate');
            // cliente.createAt = datePipe.transform(cliente.createAt, 'EEE dd, MMM yyyy');
            // EEE Muestra el dia de la semana abreviado; EEEE muestra el dia de la semana completo; Lo mismo con el mes
            // cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
            return cliente;
          });
          return response;
      }),
      tap( response => {
          console.log('ClientesComponent: tap 2');
          (response.content as Cliente[]).forEach ( cliente => {
            console.log(cliente.nombre);
          })
        }
      )
    );

  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if ( e.status==400 ) {
          return throwError(e);
        }

        console.error(e.error.mensaje);
        // swal('Error al crear el cliente', e.error.mensaje, 'error');
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['clientes'])
        console.error(e.error.mensaje);
        swal('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {

        if ( e.status==400 ) {
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal('Error al editar el cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal('Error al eliminar el cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }
}
