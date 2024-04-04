import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { contactoInterface } from '../../core/interfaces/contacto.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})

export class ContactoService {

  constructor(private httpClient: HttpClient) { }

  enviarFormularioContacto(contacto: contactoInterface){
    return this.httpClient.post(`${base_url}/contacto`, contacto)
  }

}
