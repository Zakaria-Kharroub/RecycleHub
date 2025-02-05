import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:3000";
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("currentUser") || "null")
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  public get userFirstName(): string {
    return this.currentUserValue?.firstName || '';
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.get(`${this.apiUrl}/users?email=${credentials.email}`).pipe(
      tap((users: any) => {
        const user = users[0];
        console.log('User found:', user); // Log the user found
        if (user && user.password === credentials.password) {
          const userToStore = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          };
          localStorage.setItem("currentUser", JSON.stringify(userToStore));
          this.currentUserSubject.next(userToStore);
        } else {
          console.error('Incorrect email or password');
          throw new Error('Email ou mot de passe incorrect');
        }
      })
    );
  }

  register(user: any): Observable<any> {
    const userData = { ...user };
    if (userData.profilePicture === null) {
      delete userData.profilePicture;
    }



    return this.http.post(`${this.apiUrl}/users`, userData).pipe(
      tap((response: any) => {
        const userToStore = {
          id: response.id,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
        };
        localStorage.setItem("currentUser", JSON.stringify(userToStore));
        this.currentUserSubject.next(userToStore);
      })
    );
  }

  logout() {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
