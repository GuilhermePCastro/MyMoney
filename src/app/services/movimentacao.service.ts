import { Movimentacao } from './../models/movimentacao';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EMPTY } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MovimentacaoService {

  constructor(private http: HttpClient) { }

  // Função que retorna todos os dados cdastrados no endPoint
  list(): Observable<Movimentacao[]>{
    return this.http.get<Movimentacao[]>(environment.apiEndpoint + '/movimentacao');
  }

  // Função que cadastra a movimentação no endPoint com o que foi passado em parâmetro
  insert(movimentacao?: Movimentacao): Observable<Movimentacao>{

    // Se não passar nada, retorna EMPTY
    if (!movimentacao){
      return EMPTY;
    }
    return this.http.post<Movimentacao>(environment.apiEndpoint + '/movimentacao', movimentacao);

  }

  // Função que altera a movimentação no endPoint com o que foi passado em parâmetro
  update(movimentacao?: Movimentacao): Observable<Movimentacao>{

    // Se não passar nada, retorna EMPTY
    if (!movimentacao){
      return EMPTY;
    }
    return this.http.put<Movimentacao>(`${environment.apiEndpoint}/movimentacao/${movimentacao.id}`, movimentacao);

  }

   // Função que deleta a movimentação no endPoint de acordo com o Id passado
  delete(id: number): Observable<any>{
    return this.http.delete<any>(`${environment.apiEndpoint}/movimentacap/${id}`);
  }



}
