import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { EntradaComponent } from './views/entrada/entrada.component';
import { SaidaComponent } from './views/saida/saida.component';
import { SobreComponent } from './views/sobre/sobre.component';

const routes: Routes = [
                        { path: 'dashboard', component: DashboardComponent },
                        { path: 'entrada', component: EntradaComponent },
                        { path: 'saida', component: SaidaComponent },
                        { path: 'sobre', component: SobreComponent },
                        { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
                      ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
