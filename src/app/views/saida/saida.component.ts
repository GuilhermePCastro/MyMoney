import { Movimentacao } from './../../models/movimentacao';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovimentacaoService } from 'src/app/services/movimentacao.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../dialogs/confirm/confirm.component';
import { ConfirmationVo } from '../dialogs/confirm/confirmation-vo';

@Component({
  selector: 'app-saida',
  templateUrl: './saida.component.html',
  styleUrls: ['./saida.component.css']
})
export class SaidaComponent implements OnInit {

  // Aray com todas as saidas
  saidas = new Array<Movimentacao>();

  // Mensagem de erro
  msgError = '';

  // Total saida
  totalSaida = 0;

  // Movimentação selecionada
  saida?: Movimentacao;

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
    this.totalSaida = 0;

    // Função do Service que traz os registros
    this.movimentacaoService.list().subscribe(
      mov => {

        // Caso o tipo for saida "S", joga na array de saidas
        this.saidas = mov.filter((saida) => {
          return saida.mov === 'S';
        });

        // Totalizando os atributos de valores
        this.totalizaValores();

      },
      error => {

        // msg de erro e passando para função retornar o erro para o usuário
        this.msgError = 'Erro ao buscar as saídas! - Erro: ';
        this.erroService(error);

      }
    );
  }

  // Função que faz todo o calculo de valores
  totalizaValores(): void{

    // percorrendo array de movimentações
    for (let i = 0; i < this.saidas.length; i++) {

      this.totalSaida += this.saidas[i].price;

    }
  }

  // Função que inicia uma movimentação
  addMovimentacao(): void{

    // A movimentação destacada é uma nova
    this.saida = new Movimentacao();

    // Falando que é uma entrada
    this.saida.mov = 'S';

    // Falando que não é uma edição
    this.editMode = false;
  }

  // limpando o selecionado e listando de novo
  cancelar(): void{
    this.saida = undefined;
    this.list();
  }

  // Selecionando mov pelo html
  selecionaMov(mov: Movimentacao): void{

    // A movimentação destacada é a que foi selecionada na tela
    this.saida = mov;

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

    this.movimentacaoService.insert(this.saida).subscribe(
      // Se der certo, só limpa os selecionados e lista
      any => {
        this.cancelar();
      },
      error => {
        this.msgError = 'Erro ao salvar a saída! - Erro: ';
        this.erroService(error);
      }
    );
  }

  // Função que usa o serviço para alterar os dados
  private update(): void {
    this.movimentacaoService.update(this.saida).subscribe(
       // Se der certo, só limpa os selecionados e lista
      any => {
        this.cancelar();
      },
      error => {
        this.msgError = 'Erro ao alterar a saída! - Erro: ';
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
          this.msgError = 'Erro ao deletar a saída! - Erro: ';
          this.erroService(error);
        }
      );
    }
  }

}
