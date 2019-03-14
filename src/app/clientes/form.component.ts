import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  cliente: Cliente = new Cliente();
  regiones: Region[];
  titulo: string = "Crear cliente";

  errores: string[];

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // this.cargarCliente();
    this.activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente )
      }
    });
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  create(): void {
    console.log(this.cliente);
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']),
        // swal('Nuevo cliente', `Cliente ${json.cliente.nombre} creado con éxito`, 'success')
        swal('Nuevo cliente', `El cliente ${cliente.nombre} se ha creado correctamente`, 'success')
      },
      err => {
        this.errores = err.error.errors as string[];
        console.log("Código de error desde el backend: " + err.status);
        console.log(err.error.errors);
      }
    )
  }

  cargarCliente(): void {
    // this.activatedRoute.params.subscribe(params => {
    //   let id = params['id']
    //   if (id) {
    //     this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente )
    //   }
    // })
  }

  update():void {
    console.log(this.cliente);
    this.clienteService.update(this.cliente)
      .subscribe( json => {
        this.router.navigate(['/clientes'])
        swal('Cliente Actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success')
      },
      err => {
        this.errores = err.error.errors as string[];
        console.log("Código de error desde el backend: " + err.status);
        console.log(err.error.errors);
      }
    )
  }

  compararRegion(o1: Region, o2: Region): boolean {
    if(o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 == null || o2 == null || o1 == undefined || o2 == undefined ? false : o1.id == o2.id;
  }

}
