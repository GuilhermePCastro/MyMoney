import { Movimentacao } from './../../models/movimentacao';
import { MovimentacaoService } from './../../services/movimentacao.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Aray com todas as movimentações, só entradas e só saídas
  movimentacoes = new Array<Movimentacao>();
  entradas = new Array<Movimentacao>();
  saidas = new Array<Movimentacao>();

  // Mensagem de erro
  msgError = '';

  // Totais
  totalGeral = 0;
  totalEntrada = 0;
  totalSaida = 0;
  porEconomia = 0;


  constructor(private movimentacaoService: MovimentacaoService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.list();
  }

  // Função que mostra a snackBar com erro
  msgErro(msg: string): void{

    // abrindo SnackBar
    this.snackBar.open(msg, '', {duration: 3000});
    // Mensagem, Ação, Objeto de config

  }

   // Função que monsta a msg de erro
  private erroService(error: HttpErrorResponse): void {
    const e = error as HttpErrorResponse;
    this.msgErro(this.msgError + e.statusText);
  }

  list(): void{
    this.movimentacaoService.list().subscribe(
      mov => {

        this.movimentacoes = mov;
        this.pegaEntradas();
        this.pegaSaidas();
        this.totalizaValores();

      },
      error => {

        this.msgError = 'Erro ao buscar as movimentações! - Erro: ';
        this.erroService(error);

      }
    );
  }

  pegaEntradas(): void{
    this.entradas = this.movimentacoes.filter((entrada) => {
      return entrada.mov === 'E';
    });
  }

  pegaSaidas(): void{
    this.saidas = this.movimentacoes.filter((saida) => {
      return saida.mov === 'S';
    });
  }

  totalizaValores(): void{

    for (let i = 0; i < this.movimentacoes.length; i++) {

      if (this.movimentacoes[i].mov === 'E'){

        this.totalGeral += this.movimentacoes[i].price;
        this.totalEntrada += this.movimentacoes[i].price;

      }else{

        this.totalGeral -= this.movimentacoes[i].price;
        this.totalSaida += this.movimentacoes[i].price;

      }
    }

    this.porEconomia =  Math.round((this.totalGeral * 100) / this.totalEntrada);
  }


}
