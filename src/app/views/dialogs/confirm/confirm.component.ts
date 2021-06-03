import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationVo } from './confirmation-vo';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationVo) { }

  ngOnInit(): void {
  }

  simClick(){
    this.data.pergunta = true;
    this.dialogRef.close(this.data);
  }

  naoClick(){
    this.data.pergunta = false;
    this.dialogRef.close(this.data);
  }

}
