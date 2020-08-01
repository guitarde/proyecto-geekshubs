import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { UserLogin } from '../../models/user-login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  public loginInvalid: boolean;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _router: Router,
    private loginService: LoginService) { }

  async ngOnInit() {

    this.form = this.fb.group({
      email: ['admin2@email', Validators.email],
      password: ['123456', Validators.required]
    });
  }

  async onSubmit() {
    this.loginInvalid = false;

    if (this.form.valid) {
      try {
        const username = this.form.get('email').value;
        const password = this.form.get('password').value;

        const user = new UserLogin(
          username,
          password
        );
        this.loginService.login(user).subscribe(value => {
          this._router.navigate(['/users']);
        });
      } catch (err) {
        this.loginInvalid = true;
      }
    }
  }
}
