import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../../models/user.type';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MessageComponent } from '../dialog/message/message.component';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  requiredTypeUserTab = true;
  title = 'New User';
  editUser: boolean;
  identificationType: string;

  activateTabUserPatient = false;
  activateTabUserProfesional = false;

  selecteTabTypeUser = 0;

  user: User = {
    id: 0,
    name: '',
    surname: '',
    genero: '',
    address: {
      city: '',
      street: '',
      number: '',
      door: '',
      codePostal: ''
    },
    patient: {
      nch: '',
      insurer: {
        cardNumber: '',
        insurerName: '',
        insurerType: ''
      }
    },
    profesional: {
      nColegiado: '',
      profesionalType: ''
    }
  };

  constructor(private _userverService: UserService, private _snackBar: MatSnackBar,
    private _router: Router, private dialog: MatDialog, private rutaActiva: ActivatedRoute) {
    this.rutaActiva.data.subscribe(event => {
      if (event.type === 'edit') {
        this.title = 'Edit';
        this.editUser = true;
        this._userverService.getUserById(this.rutaActiva.snapshot.params.id)
          .subscribe((resp: any) => {
            this.user = resp;
            this.evaluateTypeUser(this.user);
          });
      }
    });
  }

  ngOnInit(): void {

  }

  saveUser(form: NgForm) {

    if (form.invalid) {
      this.openSnackBar('Review required fields', 'OK');
      return;
    }

    if (this.editUser) {
      this._userverService.editUser(this.user)
        .subscribe(() => {
          this._router.navigate([`/users/${this.user.id}`], { state: { user: this.user } });
          this.messageDialog('Successful user editing');
        });
    } else {
      this._userverService.newUser(this.user)
        .subscribe(() => {
          this.messageDialog('User successfully added');
          this._router.navigate([`/users/${this.user.id}`], { state: { user: this.user } });
        });
    }

  }

  getTypeProfesional() {
    return ['DOCTOR', 'NURSE', 'ADMIN'];
  }

  getTypeInsurer() {
    return ['HEALTH', 'FAMILY', 'DENTAL'];
  }


  /**
   * Change the value of a properties of input
   * @param typeTabUser index of type tab {Profesional or Patient}
   */
  typeUserTab(typeTabUser: number) {
    this.requiredTypeUserTab = typeTabUser === 0 ? true : false;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  messageDialog(message: string) {
    this.dialog.open(MessageComponent, {
      data: message
    });
  }

  /**
   * Metho que comprueba que typo de usuarios es en el momento de realizar una edicion de usuairo
   */

  evaluateTypeUser(user: User) {
    if ('patient' in user && user.patient.nch.length > 0) {
      this.activateTabUserProfesional = !this.activateTabUserPatient;
    } else {
      this.activateTabUserPatient = !this.activateTabUserProfesional;
      this.selecteTabTypeUser = 1;
    }
  }
}
