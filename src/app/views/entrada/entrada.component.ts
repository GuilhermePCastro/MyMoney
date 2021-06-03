import { Movimentacao } from './../../models/movimentacao';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovimentacaoService } from 'src/app/services/movimentacao.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../dialogs/confirm/confirm.component';
import { ConfirmationVo } from '../dialogs/confirm/confirmation-vo';

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.css']
})
export class EntradaComponent implements OnInit {

  // Aray com todas as entradas
  entradas = new Array<Movimentacao>();

  // Mensagem de erro
  msgError = '';

  // Total entrada
  totalEntrada = 0;

  // Movimentação selecionada
  entrada?: Movimentacao;

  // modo de salvar
  editMode = false;


  constructor(private movimentacaoService: MovimentacaoService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) { }

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

    // Zerando o total para calcular de novo
    this.totalEntrada = 0;

    // Função do Service que traz os registros
    this.movimentacaoService.list().subscribe(
      mov => {

        // Caso o tipo for entrada "E", joga na array de entradas
        this.entradas = mov.filter((entrada) => {
          return entrada.mov === 'E';
        });

        // Totalizando os atributos de valores
        this.totalizaValores();

      },
      error => {

        // msg de erro e passando para função retornar o erro para o usuário
        this.msgError = 'Erro ao buscar as entradas! - Erro: ';
        this.erroService(error);

      }
    );
  }

  // Função que faz todo o calculo de valores
  totalizaValores(): void{

    // percorrendo array de movimentações
    for (let i = 0; i < this.entradas.length; i++) {

      this.totalEntrada += this.entradas[i].price;

    }
  }

  // Função que inicia uma movimentação
  addMovimentacao(): void{
    // A movimentação destacada é uma nova
    this.entrada = new Movimentacao();

    // Falando que é uma entrada
    this.entrada.mov = 'E';

    // Falando que não é uma edição
    this.editMode = false;
  }

  // limpando o selecionado e listando de novo
  cancelar(): void{
    this.entrada = undefined;
    this.list();
  }

  // Selecionando mov pelo html
  selecionaMov(mov: Movimentacao): void{
    // A movimentação destacada é a que foi selecionada na tela
    this.entrada = mov;

    // Falando que é uma edição
    this.editMode = true;
  }

  // Função que verifica a operação para salvar
  salvar(): void{

    if (!this.editMode){

      // Inserindo os dados
      this.insert();

    }else{

      // Alterando os dados
      this.update();

    }

  }


  // Função que usa o serviço para salvar os dados
  private insert(): void {

    this.movimentacaoService.insert(this.entrada).subscribe(
      // Se der certo, só limpa os selecionados e lista
      any => {
        this.cancelar();
      },
      error => {
        this.msgError = 'Erro ao salvar a entradas! - Erro: ';
        this.erroService(error);
      }
    );
  }

  // Função que usa o serviço para alterar os dados
  private update(): void {
    this.movimentacaoService.update(this.entrada).subscribe(
       // Se der certo, só limpa os selecionados e lista
      any => {
        this.cancelar();
      },
      error => {
        this.msgError = 'Erro ao alterar a entradas! - Erro: ';
        this.erroService(error);
      }
    );
  }

  confirmar(movId?: number): void{
    const result = this.dialog.open(ConfirmComponent, {
      width: '300px',
      data: {id: movId, pergunta: false}
    });

    result.afterClosed().subscribe((confirmationVo: ConfirmationVo) => {
      if(confirmationVo && confirmationVo.pergunta){
        this.remover(movId);
      }
    });

  }

  remover(removeId?: number): void{
    if (removeId){
      this.movimentacaoService.delete(removeId).subscribe(
        any => {
          this.list();
        },
        error => {
          this.msgError = 'Erro ao deletar a entrada! - Erro: ';
          this.erroService(error);
        }
      );
    }
  }




}
