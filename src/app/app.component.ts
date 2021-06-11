import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MyMoney';
  screenWidth = window.innerWidth;

  // Validando o tamanho da tela
  @HostListener('window:resize', ['$event'])
  onResize(){
    this.screenWidth = window.innerWidth;
  }

}
