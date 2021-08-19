import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2'
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'

})
export class ClientesComponent implements OnInit {

clientes: Cliente[];
paginador : any;

  constructor(private clienteService: ClienteService,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');
    if(!page){
      page=0;
    }
   this.clienteService.getClientes(page)
   .pipe(
     tap(response =>{
       (response.content as Cliente[]).forEach(cliente =>
         console.log(cliente.nombre));
       })
   ).subscribe(
   response => {this.clientes = response.content as Cliente[];
                this.paginador = response;
   })
  }
   );
  }

  delete(cliente:Cliente):void{
    swal({
  title: 'Esta seguro?',
  text: 'You will not be able to recover this imaginary file!',
  type: 'warning',
  showCancelButton:true,
  confirmButtonText:'Si,eliminar',
  cancelButtonText:'No,cancelar',
  confirmButtonClass:'btn btn-success',
  cancelButtonClass:'btn btn-danger'

}).then((result) =>{

  if (result.value) {
    this.clienteService.delete(cliente.id)
    .subscribe(response =>{
      this.clientes = this.clientes.filter(cli => cli !== cliente)
    swal("Deleted!", "Your imaginary file has been deleted.", "success");
   }
  )
 }
});
}

}
