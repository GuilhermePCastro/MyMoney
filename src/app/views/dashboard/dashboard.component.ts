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

  // Mensagens
  msgError = '';
  msgEconomia = '';

  // Totais gerais
  totalGeral = 0;
  totalEntrada = 0;
  totalSaida = 0;
  porEconomia = 0;

  // Totais por categoria
  totalLazer = 0;
  totalComida = 0;
  totalCasa = 0;
  totalOutros = 0;

  // Classes Styles
  classeTextoEconomia = '';

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
  erroService(error: HttpErrorResponse): void {
    const e = error as HttpErrorResponse;
    this.msgErro(this.msgError + e.statusText);
  }

  // Função que lista os dados
  list(): void{

    // Zerando os totais para calcular de novo
    this.totalGeral = 0;
    this.totalEntrada = 0;
    this.totalSaida = 0;
    this.porEconomia = 0;
    this.totalLazer = 0;
    this.totalComida = 0;
    this.totalCasa = 0;
    this.totalOutros = 0;

    // Funçã odo Service que traz os registros
    this.movimentacaoService.list().subscribe(
      mov => {

        // Array de movimentações
        this.movimentacoes = mov;

        // Pegando os dados de entrada
        this.pegaEntradas();

        // Pegando os dados de saída
        this.pegaSaidas();

        // Totalizando os atributos de valores
        this.totalizaValores();

      },
      error => {

        // msg de erro e passando para função retornar o erro para o usuário
        this.msgError = 'Erro ao buscar as movimentações! - Erro: ';
        this.erroService(error);

      }
    );
  }

  // Função que pega as entradas
  pegaEntradas(): void{

    // Caso o tipo for entrada "E", joga na array de entradas
    this.entradas = this.movimentacoes.filter((entrada) => {
      return entrada.mov === 'E';
    });
  }

  // Função que pega as saidas
  pegaSaidas(): void{

    // Caso o tipo for saida "S", joga na array de saidas
    this.saidas = this.movimentacoes.filter((saida) => {
      return saida.mov === 'S';
    });
  }

  // Função que faz todo o calculo de valores
  totalizaValores(): void{

    // percorrendo array de movimentações
    for (let i = 0; i < this.movimentacoes.length; i++) {

      // caso for entrada, soma com o total de entrada e total geral
      if (this.movimentacoes[i].mov === 'E'){

        this.totalGeral += this.movimentacoes[i].price;
        this.totalEntrada += this.movimentacoes[i].price;

      }else{ // Se for saida, subtrai do total geral e soma no total de saidas

        this.totalGeral -= this.movimentacoes[i].price;
        this.totalSaida += this.movimentacoes[i].price;

      }
    }

    // Verificando a % da economia
    this.calculaEconomia();

    // Totalizando as categorias
    this.totalizaCategoria();
  }

  calculaEconomia(): void{

    // Verificando a % da economia
    this.porEconomia =  Math.round((this.totalGeral * 100) / this.totalEntrada);

    // Verificando a % para definir o nivel
    if (this.porEconomia > 60){
      this.msgEconomia = 'Você está indo muito bem!';
      this.classeTextoEconomia = 'por-bom';
    }else if (this.porEconomia < 60 &&  this.porEconomia >= 50){
      this.msgEconomia = 'Continue economizando!';
      this.classeTextoEconomia = 'por-bom';
    }else if(this.porEconomia < 50 &&  this.porEconomia >= 30){
      this.msgEconomia = 'Você deveria economizar mais!';
      this.classeTextoEconomia = 'por-medio';
    }else if(this.porEconomia < 30 &&  this.porEconomia >= 10){
      this.msgEconomia = 'Abre o olho em!';
      this.classeTextoEconomia = 'por-medio';
    }
    else if(this.porEconomia < 10 &&  this.porEconomia > 0){
      this.msgEconomia = 'Você está quase sem nada!';
      this.classeTextoEconomia = 'por-ruim';
    }else{
      this.msgEconomia = 'Seu nome vai para o SPC-SERASA!';
      this.classeTextoEconomia = 'por-ruim';
    }
  }

  // Função que calcula o total por categoria
  totalizaCategoria(): void{

    // Percorrendo array de saidas
    for (let i = 0; i < this.saidas.length; i++) {

      // Verificando em qual categoria se encaixa a saida
      switch (this.saidas[i].category){

        case 'Lazer' :
          this.totalLazer += this.saidas[i].price;
          break;

        case 'Comida' :
          this.totalComida += this.saidas[i].price;
          break;

        case 'Casa' :
          this.totalCasa += this.saidas[i].price;
          break;

        case 'Outros' :
          this.totalOutros += this.saidas[i].price;
          break;
      }
    }
  }


}
